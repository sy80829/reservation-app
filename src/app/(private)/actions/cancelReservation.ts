"use server";

import { getReservation } from "@/lib/getReservation";
import { sendMail } from "@/lib/sendMail";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  id: number;
  version: number;
};

export async function cancelReservation ({ id, version }: Props) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if(userError || !user || !user.email ) {
        redirect("/login");
    }

    const {data, error} = await supabase.from("reservations").update({
        is_canceled: true,
        canceled_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("version", version)
    .select();

    if(error) throw error;

    if(!data || data.length === 0) {
        throw new Error("更新競合が発生しました");
    }

    //予約データ取得
    const reservData = await getReservation(id);

    if(reservData){
        //メール送信
        sendMail({
            type: "cancel",
            email: user.email,
            name: user.user_metadata.name,
            reservData: reservData,
        });
    }

    redirect("/cancelComplete");
}