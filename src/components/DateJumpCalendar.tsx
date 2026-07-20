import { useState, useRef, type TouchEvent } from 'react';
import { reservCalendar } from '@/types';
import { Calendar } from './ui/calendar';
import { ja } from 'date-fns/locale';
import { addMonths, subMonths } from 'date-fns';

// これ未満の横移動はタップ/誤操作とみなし月送りしない
const SWIPE_THRESHOLD_PX = 40;

type Props = {
  reservCalendar: reservCalendar[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  setShowCalenadar: (showCalendar: boolean) => void;
};

export default function DateJumpCalendar({
  reservCalendar,
  selectedDate,
  onSelect,
  setShowCalenadar,
}: Props) {
  // "2026-07-17" → Date
  function stringToDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // monthは0始まりなので-1
  }

  //表示中の月（スワイプで月送りできるようcontrolledにする）
  const [month, setMonth] = useState<Date>(
    selectedDate ? stringToDate(selectedDate) : new Date(),
  );
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const t = e.changedTouches[0];
    const deltaX = t.clientX - start.x;
    const deltaY = t.clientY - start.y;

    // 横方向のスワイプとみなせる場合だけ月を切り替える（縦スクロールは邪魔しない）
    if (
      Math.abs(deltaX) > SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      setMonth((prev) => (deltaX > 0 ? subMonths(prev, 1) : addMonths(prev, 1)));
    }
  };

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
    onSelect(dateStr); // 親から受け取ったonSelectを呼ぶ（Top.tsxのdateClickへ、selectedDateもここで更新される）
    setShowCalenadar(false);
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Calendar
        onSelect={handleSelect}
        mode="single"
        disabled={dateCheck}
        selected={selectedDate ? stringToDate(selectedDate) : undefined}
        month={month}
        onMonthChange={setMonth}
        locale={ja}
        className="border rounded-lg shadow-lg bg-white"
      />
    </div>
  );
}
