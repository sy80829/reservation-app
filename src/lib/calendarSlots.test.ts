import { describe, it, expect } from 'vitest';
import {
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
  applyReservation,
  applyCourse,
  mergeFreeSlots,
  createReservationMapByStylistId,
} from './calendarSlots';

describe('timeToMinutes / minutesToTime', () => {
  it('"11:30" を691分ではなく690分に変換する', () => {
    expect(timeToMinutes('11:30')).toBe(690);
  });

  it('690分を"11:30"に戻す', () => {
    expect(minutesToTime(690)).toBe('11:30');
  });
});

describe('generateTimeSlots', () => {
  it('10:00〜19:00を30分刻みで、18コマ生成する', () => {
    const slots = generateTimeSlots();
    expect(slots).toHaveLength(18);
    expect(slots[0]).toMatchObject({ start: 600, end: 630 }); // 10:00-10:30
    expect(slots[17]).toMatchObject({ start: 1110, end: 1140 }); // 18:30-19:00
  });
});

describe('applyReservation', () => {
  it('予約時間と重なる枠をreservedにする', () => {
    const slots = generateTimeSlots();
    // 11:00(660)〜12:00(720)の予約
    const result = applyReservation(slots, [
      { reserv_time_st: 660, reserv_time_ed: 720 },
    ]);

    const at1100 = result.find((s) => s.start === 660);
    const at1030 = result.find((s) => s.start === 630);

    expect(at1100?.status).toBe('reserved');
    expect(at1030?.status).toBe('available'); // 予約と重ならない枠は影響を受けない
  });
});

describe('applyCourse', () => {
  it('コースの所要時間分、連続で空いている枠だけcanReserveがtrueになる', () => {
    const slots = generateTimeSlots();
    // 11:30(690)だけ埋まっている状態にする
    const withReservation = applyReservation(slots, [
      { reserv_time_st: 690, reserv_time_ed: 720 },
    ]);

    // 90分コース = 3コマ連続必要
    const result = applyCourse(withReservation, 90);

    const at1030 = result.find((s) => s.start === 630); // 10:30開始 → 11:30を含むので×
    const at1200 = result.find((s) => s.start === 720); // 12:00開始 → 12:00,12:30,13:00は空いているので○

    expect(at1030?.canReserve).toBe(false);
    expect(at1200?.canReserve).toBe(true);
  });
});

describe('mergeFreeSlots（複数スタイリストの空き状況の統合）', () => {
  it('誰か1人でも空いていればtrueになる', () => {
    const stylistSlots = [
      {
        stylist_id: '1',
        slots: [{ start: 600, end: 630, status: 'reserved', canReserve: false }],
      },
      {
        stylist_id: '2',
        slots: [{ start: 600, end: 630, status: 'available', canReserve: true }],
      },
    ];

    const result = mergeFreeSlots(stylistSlots);

    expect(result[0].canReserve).toBe(true);
  });

  it('全員埋まっていればfalseになる', () => {
    const stylistSlots = [
      {
        stylist_id: '1',
        slots: [{ start: 600, end: 630, status: 'reserved', canReserve: false }],
      },
      {
        stylist_id: '2',
        slots: [{ start: 600, end: 630, status: 'reserved', canReserve: false }],
      },
    ];

    const result = mergeFreeSlots(stylistSlots);

    expect(result[0].canReserve).toBe(false);
  });
});

describe('createReservationMapByStylistId（回帰テスト：予約実績のないスタイリストが漏れるバグ）', () => {
  it('予約が1件もないスタイリストも、空き扱いの対象として含まれる', () => {
    // Inuだけ予約があり、Penguin・Butaは一度も予約されたことがない
    const reservations = [
      {
        reserv_date: '2026-07-20',
        reserv_time_st: 690,
        reserv_time_ed: 720,
        stylist_id: '1', // Inu
      },
    ];
    const allStylistIds = ['1', '2', '3']; // Inu, Penguin, Buta

    const map = createReservationMapByStylistId(reservations, allStylistIds);

    // 3人分のキーが存在するはず（予約実績の有無に関わらず）
    expect(Array.from(map.keys()).sort()).toEqual(['1', '2', '3']);

    // Penguin(2)・Buta(3)は空の予約リストを持つ（＝完全に空いている）
    expect(map.get('2')?.get('2026-07-20') ?? []).toEqual([]);
    expect(map.get('3')?.get('2026-07-20') ?? []).toEqual([]);
  });
});
