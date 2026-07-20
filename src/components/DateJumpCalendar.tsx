import { useState, useRef, type PointerEvent } from 'react';
import { reservCalendar } from '@/types';
import { Calendar } from './ui/calendar';
import { ja } from 'date-fns/locale';
import { addMonths, subMonths } from 'date-fns';

// これ未満の横移動はタップ/誤操作とみなし月送りしない
const SWIPE_THRESHOLD_PX = 40;
// これを超えて動いたら「スワイプ中」とみなしポインタをキャプチャする
// （小さすぎると日付タップまでスワイプ扱いになり、大きすぎるとキャプチャ前に
// 　指の下の日付ボタンにイベントを奪われて検知できなくなる）
const DRAG_START_THRESHOLD_PX = 10;

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
  const dragRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
    captured: boolean;
  } | null>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // マウスのドラッグでは月送りしない（PC操作は矢印ボタン等を使う想定）
    if (e.pointerType === 'mouse') return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
      captured: false,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || drag.captured) return;

    const deltaX = e.clientX - drag.x;
    const deltaY = e.clientY - drag.y;

    // 明確に横方向へ動き始めたときだけポインタをキャプチャする。
    // ここでcaptureすることで、指の下にある日付ボタン（タップ選択用）に
    // イベントを奪われず最後まで自前でスワイプを追跡できる。
    // 縦移動が大きい場合はページの縦スクロールを優先し、何もしない。
    if (Math.abs(deltaX) > DRAG_START_THRESHOLD_PX) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        drag.captured = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      } else {
        dragRef.current = null;
      }
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    // タップ（キャプチャに至らなかった操作）は日付選択に任せてここでは何もしない
    if (!drag || drag.pointerId !== e.pointerId || !drag.captured) return;

    const deltaX = e.clientX - drag.x;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      setMonth((prev) => (deltaX > 0 ? subMonths(prev, 1) : addMonths(prev, 1)));
    }
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
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
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: 'pan-y' }}
    >
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
