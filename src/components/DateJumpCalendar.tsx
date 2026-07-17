import { cn } from '@/lib/utils';
import { reservCalendar } from '@/types';
import React, { RefObject, useState } from 'react';
import { Calendar } from './ui/calendar';
type Props = {
  reservCalendar: reservCalendar[];
  onSelect: (date: string) => void;
  setShowCalenadar: (showCalendar: boolean) => void;
};

export default function DateJumpCalendar({
  reservCalendar,
  onSelect,
  setShowCalenadar,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // "2026-07-17" → Date
  function stringToDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // monthは0始まりなので-1
  }

  // Date → "2026-07-17"
  function dateToString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  const dateCheck = (date: Date) => {
    const dateStr = dateToString(date);
    return !reservCalendar.some((c) => c.date === dateStr);
    //       ↑「存在しない」ならtrue（＝disabled）
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return; // undefinedなら何もしない
    const dateStr = dateToString(date); // Date → "2026-07-17" に変換
    setSelectedDate(dateStr); // 自分のstateを更新
    onSelect(dateStr); // 親から受け取ったonSelectを呼ぶ（Top.tsxのdateClickへ）
    setShowCalenadar(false);
  };

  return (
    <Calendar
      onSelect={handleSelect}
      mode="single"
      disabled={dateCheck}
      selected={selectedDate ? stringToDate(selectedDate) : undefined}
      className="border rounded-lg shadow-lg bg-white"
    />
  );
}
