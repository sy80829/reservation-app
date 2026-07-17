// app/api/calendar/route.ts

import { createClient } from "@/lib/supabase/server";
import { formatedReservSlots, formattedReservations, Reservation, reservCalendar, reservSlots, reservTime, StylistResult } from "@/types";
import { NextRequest, NextResponse } from "next/server"

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
      const { error: stylistsCheckError } = await supabase.from("stylists").select("id").eq("id", parsedStylistId).single();

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
    console.log("parseExcludeId:", parseExcludeId);
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
    // for (const [date, reservations] of reservationMap) {
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
    console.log("parseExcludeId:", parseExcludeId);
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
    const { data: allStylistsData } = await supabase.from("stylists").select("id");
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

  //11:00 →　数値
  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
  }

  //数値　→　11:00 
  function minutesToTime(minutes: number) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}:${m.toString().padStart(2, "0")}`
  }
  function formatSlotsTime(slots: reservSlots[]) {
    return slots.map(slot => ({
      ...slot,
      start: minutesToTime(slot.start),
      end: minutesToTime(slot.end)
    }))
  }

// 時間枠生成
// [
//   { start: 600, end: 630, status: "available", canReserve: false },
//   { start: 630, end: 660, status: "available", canReserve: false },
//   { start: 660, end: 690, status: "available", canReserve: false },
//   { start: 690, end: 720, status: "available", canReserve: false },
//   ...
// ]
function generateTimeSlots() {
  const slots = []
  let current = 10 * 60
  const end = 19 * 60

  while (current < end) {
    slots.push({
      start: current,
      end: current + 30,
      status: "available",
      canReserve: false
    })
    current += 30
  }

  return slots
}

// Map作成
// Map {
//   1: [
//     { start: 660, end: 720 },  // 11:00-12:00
//     { start: 780, end: 840 }   // 13:00-14:00
//   ],
//   2: [
//     { start: 600, end: 630 }   // 10:00-10:30
//   ]
// }
function createReservationMapByDate(reservations: formattedReservations[]) {
  const map = new Map<string, formattedReservations[]>();

  for (const r of reservations) {
    //スタイリスト予約なし
      if (!map.has(r.reserv_date)) {
        map.set(r.reserv_date, []);
      }
      map.get(r.reserv_date)!.push(r);
    }

  return map
}

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
function createReservationMapByStylistId(reservations: formattedReservations[], allStylistIds: string[]) {
  const stylistMap = new Map<string, formattedReservations[]>();

  // 予約実績のないスタイリストも空き扱いで対象に含めるため、先に全員分を空配列で初期化
  for (const id of allStylistIds) {
    stylistMap.set(id, []);
  }

  // stylistごとにまとめる
  for (const r of reservations) {
    if (!r.stylist_id) continue;

    if (!stylistMap.has(r.stylist_id)) {
      stylistMap.set(r.stylist_id, []);
    }

    stylistMap.get(r.stylist_id)!.push(r);
  }

  // dateごとにまとめる
  const result = new Map<string, Map<string, formattedReservations[]>>();

  // [key, value]の形で取り出して回す
  for (const [stylist_id, reservs] of stylistMap) {
    const dateMap = createReservationMapByDate(reservs);
    result.set(stylist_id, dateMap);
  }

  return result;
}

// status付与
// [
//   {
//     "date": "2026-03-28",
//     "start": 600,
//     "end": 630,
//     "status": "available",
//   },
//   {
//     "date": "2026-03-28",
//     "start": 630,
//     "end": 660,
//     "status": "available",
//   }
// ]
function applyReservation(slots: reservSlots[], reservTime: reservTime[]) {
  for (const slot of slots) {
    for (const t of reservTime) {
      if (
        slot.start < t.reserv_time_ed &&
        t.reserv_time_st < slot.end
      ) {
        slot.status = "reserved"
        break;
      }
    }
  }
  return slots
}

// 連続チェック
// [
//   {
//     "date": "2026-03-28",
//     "start": 600,
//     "end": 630,
//     "status": "available",
//     "canReserve": true
//   },
//   {
//     "date": "2026-03-28",
//     "start": 630,
//     "end": 660,
//     "status": "available",
//     "canReserve": false
//   }
// ]
function applyCourse(slots: reservSlots[], duration: number) {
  const needSlots = duration / 30;

  for (let i = 0; i < slots.length; i++) {
    let ok = true

    for (let k = 0; k < needSlots; k++) {
      if (!slots[i + k] || slots[i + k].status !== "available") {
        ok = false
        break
      }
    }

    slots[i].canReserve = ok
  }

  return slots
}

// フリー統合
function mergeFreeSlots(stylistSlots: StylistResult[]) {
  if (stylistSlots.length === 0) {
    // 全部空きとして返す
    return generateTimeSlots().map(slot => ({
      ...slot,
      canReserve: true
    }))
  }
  
  const base = stylistSlots[0].slots

  return base.map((slot, i) => {
    const canReserve = stylistSlots.some(s =>
      s.slots[i].canReserve
    )

    return {
      ...slot,
      canReserve
    }
  })
}

function generateDates(days: number) {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  return dates;
}
}