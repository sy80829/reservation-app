import {
  formattedReservations,
  reservSlots,
  reservTime,
  StylistResult,
} from "@/types";

//11:00 →　数値
export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

//数値　→　11:00
export function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${m.toString().padStart(2, "0")}`
}

export function formatSlotsTime(slots: reservSlots[]) {
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
export function generateTimeSlots() {
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
export function createReservationMapByDate(reservations: formattedReservations[]) {
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
export function createReservationMapByStylistId(reservations: formattedReservations[], allStylistIds: string[]) {
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
export function applyReservation(slots: reservSlots[], reservTime: reservTime[]) {
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
export function applyCourse(slots: reservSlots[], duration: number) {
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
export function mergeFreeSlots(stylistSlots: StylistResult[]) {
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

export function generateDates(days: number) {
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
