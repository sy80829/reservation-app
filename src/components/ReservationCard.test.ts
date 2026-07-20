import { describe, it, expect } from 'vitest';
import { calculateEndTime } from './ReservationCard';

describe('calculateEndTime', () => {
  it('分だけで終了時刻が求まる場合', () => {
    expect(calculateEndTime('10:00', 30)).toBe('10:30');
  });

  it('時間をまたぐ場合', () => {
    expect(calculateEndTime('11:30', 90)).toBe('13:00');
  });

  it('1桁の時刻は0埋めされる', () => {
    expect(calculateEndTime('9:00', 30)).toBe('09:30');
  });
});
