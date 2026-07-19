"use server";

import { createClient } from "@/lib/supabase/server";
import { parsedUpdateReservationParams } from "@/types";
import { redirect } from "next/navigation";
import { EditReservationData } from '@/atoms/editReservationDataState';
import { getReservation } from "@/lib/getReservation";
import { sendMail } from "@/lib/sendMail";

type Props = {
    editReservationData :EditReservationData;
    reservationId: string,
}

// export async function updateRservation ( { reservationId, new_start, target_date, course_id, stylist_id } : updateReservation ) {
export async function updateRservation ( { reservationId, editReservationData } : Props ) {

    if (
        !editReservationData.version ||
        !editReservationData.date ||
        !editReservationData.time ||
        !editReservationData.courseId
    ) {
        return;
    }

    const new_start = editReservationData.time + ':00';

    const supabase = await createClient();

    const parsedReservationId = Number(reservationId);

    if (isNaN(parsedReservationId)) {
        redirect("/top");
    }

    //ログインチェック
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if(userError || !user || !user.email ) {
        redirect("/login");
    }

    //整形
    const parsedStylistId =
        editReservationData.stylistId === null ? null : Number(editReservationData.stylistId);

    if (parsedStylistId !== null && isNaN(parsedStylistId)) {
        throw new Error("invalid stylist_id");
    }

    const parsedCourseId = Number(editReservationData.courseId);

    //course_id実在確認
    const { data: course, error: coursesChceckError } = await supabase.from("courses").select("duration").eq("id", parsedCourseId).single();
    
    if ( coursesChceckError ) {
        throw new Error(coursesChceckError.message);
    }

    if (parsedStylistId !== null) {
        //stylist_id実在確認
        const { error: stylistsCheckError } = await supabase.from("stylists").select("id").eq("id", parsedStylistId).single();

        if ( stylistsCheckError ) {
            throw new Error(stylistsCheckError.message);
        }
    }

    // startをdateに変換
    const toISODate = (dateStr: string, timeStr: string) => {
        const [year, month, day] = dateStr.split("-");
        const [hour, minute] = timeStr.split(":");
        console.log("year:", year);
        console.log("month:", month);
        console.log("day:", day);
        const date = new Date(
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour}:${minute}:00`
        );
        return date;    
    };

    //start+duration
    const calculateEndTime = (start: Date, duration: number) => {
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + duration);
        return end;
    };

    // start作る
    const startDate = toISODate(editReservationData.date, new_start);
    // end作る
    const endDate = calculateEndTime(startDate, course.duration);
    // new_end
    const new_end = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`

    //target_date
    const formattedDate = `${editReservationData.date}`

    const parsedParams: parsedUpdateReservationParams = {
        reservationId: parsedReservationId,
        target_date: formattedDate,
        new_start,
        new_end,
        course_id: parsedCourseId,
        stylist_id: parsedStylistId,
};

    //insert前確認
    //スタイリストなし予約
    //予約前確認+insert
    const { data, error } = await supabase.rpc('update_reservation', {
        p_id: parsedParams.reservationId,
        p_target_date: parsedParams.target_date,
        p_new_start: parsedParams.new_start,
        p_new_end: parsedParams.new_end,
        p_course_id : parsedParams.course_id,
        // Supabase生成の型ではp_stylist_idがnumber必須になっているが、
        // DB関数はnullを正しく処理する（指名なし予約）ため型を無視する
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p_stylist_id: parsedParams.stylist_id as any,
        p_user_id: user.id,
        p_version: editReservationData.version,
    });
    if(error) {
        if (error.message.includes('予約できません')) {
            redirect('/top?error=slot_unavailable');
        }
        throw new Error(error.message);
    }
    if(!data){
        console.log("dataがあありません");
        redirect("/top");
    }

    //予約データ取得
    const reservData = await getReservation(parsedReservationId);

    if(reservData){
        //メール送信
        sendMail({
            type: "update",
            email: user.email,
            name: user.user_metadata.name,
            reservData: reservData,
        });
    }

    console.log( "success " , "更新完了"); 

    // 予約完了ページへリダイレクト
    redirect(`/reservationComplete/${data.id}`);
}