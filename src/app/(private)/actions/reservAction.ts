"use server";

import { getReservation } from "@/lib/getReservation";
import { sendMail } from "@/lib/sendMail";
import { createClient } from "@/lib/supabase/server";
import { reservActionProps, reservParamsProps } from "@/types";
import { redirect } from "next/navigation";

export async function reservAction ( { new_start, target_date, course_id, stylist_id } : reservParamsProps ) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if(userError || !user || !user.email ) {
        redirect("/login");
    }

    //すでに予約があればリターン
    // const { data: result, error: e } = await supabase
    //     .from("reservations")
    //     .select(`
    //     id
    //     `)
    //     .eq("user_id", user.id)
    //     .eq("is_canceled", false)
    //     .single();
    
    // if (result) {
    //     console.log("result:", result);
    //     redirect('/errorPage?error=already_reserved');
    // }

    //整形
    const parsedStylistId =
        stylist_id === null ? null : Number(stylist_id);
    const parsedCourseId = Number(course_id);

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
        // const year = new Date().getFullYear();
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
    const startDate = toISODate(target_date, new_start);
    // end作る
    const endDate = calculateEndTime(startDate, course.duration);
    // new_end
    const new_end = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`

    //target_date
    const now = new Date();
    const year = now.getFullYear();
    const formattedDate = `${target_date}`

    const parsedParams: reservActionProps = {
        target_date: formattedDate,
        new_start,
        new_end,
        course_id: parsedCourseId,
        stylist_id: parsedStylistId,
};

    //insert前確認
    //予約前確認+insert
    const { data, error } = await supabase.rpc('create_reservation', {
        p_target_date: parsedParams.target_date,
        p_new_start: parsedParams.new_start,
        p_new_end: parsedParams.new_end,
        p_course_id : parsedParams.course_id,
        p_stylist_id: parsedParams.stylist_id as any,
        p_user_id: user.id,
    });
    if(error) {
        if (error.message.includes('すでに予約があります')) {
        redirect('/errorPage?error=already_reserved');
        }
        throw new Error(error.message);
    }
    if(!data){
        console.log("dataがあありません");
        redirect("/top");
    }

    console.log("reservData.id:" , data.id);
    console.log( "success " , "フリー予約完了");

    //予約データ取得
    const reservData = await getReservation(data.id);

    //メール送信
    sendMail({
        type: "reservation",
        email: user.email,
        name: user.user_metadata.name,
        reservData: reservData,
    });

    // 予約完了ページへリダイレクト
    redirect(`/reservationComplete/${reservData.id}`);
}