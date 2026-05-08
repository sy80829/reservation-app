import { createClient } from "@/lib/supabase/server";

export async function getReservation(id: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("reservations")
        .select(`
        id,
        reserv_date,
        reserv_time_st,
        reserv_time_ed,
        courses (
            name,
            duration,
            price
        ),
        stylists (
            name
        )
        `)
        .eq("id", id)
        .single();

    if (error || !data) {
        throw new Error("予約取得失敗");
    }

    return data;
}