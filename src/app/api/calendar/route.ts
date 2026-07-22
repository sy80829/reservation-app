// app/api/calendar/route.ts

import { createClient } from "@/lib/supabase/server";
import { Reservation, reservCalendar, formatedReservSlots, StylistResult } from "@/types";
import { NextRequest, NextResponse } from "next/server"
import {
  timeToMinutes,
  formatSlotsTime,
  generateTimeSlots,
  createReservationMapByDate,
  createReservationMapByStylistId,
  applyReservation,
  applyCourse,
  mergeFreeSlots,
  generateDates,
} from "@/lib/calendarSlots";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const course_id = searchParams.get("course_id");
  const stylist_id = searchParams.get("stylist_id");
  const excludeId = searchParams.get("excludeId");
  const supabase = await createClient();

  //整形
  const parsedStylistId =
      stylist_id == null || stylist_id === "null"
          ? null
          : Number(stylist_id);
  const parsedCourseId = Number(course_id);

  const parseExcludeId = excludeId == null || excludeId === "null" ? null : Number(excludeId);

  //course_id実在確認
  const { data: selectedCourse, error: coursesChceckError } = await supabase.from("courses").select("duration").eq("id", parsedCourseId).single();

  if ( coursesChceckError ) {
      throw new Error(coursesChceckError.message);
  }

  if (parsedStylistId !== null) {
      //stylist_id実在確認
      const { error: stylistsCheckError } = await supabase.from("stylists").select("id").eq("id", parsedStylistId).eq('is_delete', false).single();

      if ( stylistsCheckError ) {
          throw new Error(stylistsCheckError.message);
      }
  }

  let data;

  //カレンダー生成
  //スタイリスト予約あり
  if(parsedStylistId){
    //   予約取得
    //   reservations = [
    //   { reserv_date: "2026-03-17", start: "15:00:00", end: "16:30:00" },
    //   { reserv_date: "2026-03-19", start: "10:30:00", end: "12:30:00" },
    //   { reserv_date: "2026-03-19", start: "10:30:00", end: "12:30:00" }
    //   ]
    if (!parseExcludeId) {
      ({ data } = await supabase.from("reservations").select("reserv_date, reserv_time_st, reserv_time_ed").eq("stylist_id", parsedStylistId).eq("is_canceled", false));
    } else {
      ({ data } = await supabase.from("reservations").select("reserv_date, reserv_time_st, reserv_time_ed").eq("stylist_id", parsedStylistId).eq("is_canceled", false).neq('id', parseExcludeId));
    }

    const reservations : Reservation[] = data ?? [];

    //時間を分に変換
    const formattedReservations = reservations.map(r => ({
      reserv_date: r.reserv_date,
      reserv_time_st: timeToMinutes(r.reserv_time_st),
      reserv_time_ed: timeToMinutes(r.reserv_time_ed),
    }));

    //   Map化
    // reservationMap {
    //   "2026/03/20": [
    //     { start: 660, end: 720 },  // 11:00-12:00
    //     { start: 780, end: 840 }   // 13:00-14:00
    //   ],
    //   "2026/03/21": [
    //     { start: 600, end: 630 }   // 10:00-10:30
    //   ]
    // }
    const reservationMap = createReservationMapByDate(formattedReservations);

    const result: reservCalendar[] = [];

    // 1か月分の日付を生成
    const dates = generateDates(30);

    for (const date of dates) {

    const reservations = reservationMap.get(date) || [];

    //dateごとに処理
      // 時間枠生成
      // [
      //   { start: 600, end: 630, status: "available", canReserve: false },
      //   { start: 630, end: 660, status: "available", canReserve: false },
      //   ...
      // ]
      let slots = generateTimeSlots();

      slots = applyReservation(slots, reservations);
      slots = applyCourse(slots, selectedCourse.duration);
      const formatedSlots : formatedReservSlots[] = formatSlotsTime(slots);

      result.push({
        date,
        slots: formatedSlots
      });

    }

    return NextResponse.json(result);

  } else { //スタイリスト予約なし
    //   予約取得
    //   reservations = [
    //   { reserv_date: "2026-03-17", start: "15:00:00", end: "16:30:00" },
    //   { reserv_date: "2026-03-19", start: "10:30:00", end: "12:30:00" }
    //   ]
    if (!parseExcludeId) {
      ({ data } = await supabase.from("reservations").select("reserv_date, reserv_time_st, reserv_time_ed, stylist_id").eq("is_canceled", false));
    } else {
      ({ data } = await supabase.from("reservations").select("reserv_date, reserv_time_st, reserv_time_ed, stylist_id").eq("is_canceled", false).neq('id', parseExcludeId));
    }

    const reservations : Reservation[] = data ?? [];

    //時間を分に変換
    const formattedReservations = reservations.map(r => ({
      reserv_date: r.reserv_date,
      reserv_time_st: timeToMinutes(r.reserv_time_st),
      reserv_time_ed: timeToMinutes(r.reserv_time_ed),
      stylist_id: String(r.stylist_id),
    }));

    //   1: {
    //     "2026-03-20": [
    //            { start: 660, end: 720 },  // 11:00-12:00
    //            { start: 780, end: 840 }   // 13:00-14:00
    //           ],
    //     "2026-03-21": [
    //            { start: 660, end: 720 },  // 11:00-12:00
    //            { start: 780, end: 840 }   // 13:00-14:00
    //           ],
    //   }
    //   2: {
    //     "2026-03-20": [
    //            { start: 660, end: 720 },  // 11:00-12:00
    //            { start: 780, end: 840 }   // 13:00-14:00
    //           ],
    //     "2026-03-21": [
    //            { start: 660, end: 720 },  // 11:00-12:00
    //            { start: 780, end: 840 }   // 13:00-14:00
    //           },
    //   }
    //予約実績のないスタイリストも空き扱いで対象に含めるため、全スタイリストIDを取得
    const { data: allStylistsData } = await supabase.from("stylists").select("id").eq('is_delete', false);
    const allStylistIds = (allStylistsData ?? []).map((s) => String(s.id));

    const reservationMap = createReservationMapByStylistId(formattedReservations, allStylistIds);

    const result: reservCalendar[] = [];

    // 1か月分の日付を生成
    const dates = generateDates(30);

    // ② 日付ごとに処理
    for (const date of dates) {

      const stylistResults: StylistResult[] = [];

      // ③ 全スタイリスト分回す
      for (const [stylist_id, dateMap] of reservationMap) {

        const reservations = dateMap.get(date) || [];

        let slots = generateTimeSlots();
        slots = applyReservation(slots, reservations);
        slots = applyCourse(slots, selectedCourse.duration);

        stylistResults.push({
          stylist_id,
          slots
        });
      }

      // ④ ここでmerge（←重要）
      const mergedSlots = mergeFreeSlots(stylistResults);

      // ⑤ 最後にフォーマット
      const formatedSlots = formatSlotsTime(mergedSlots);

      result.push({
        date,
        slots: formatedSlots
      });
    }

    return NextResponse.json(result);
  }
}
