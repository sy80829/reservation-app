import { reservCalendar } from '@/types';
import { Calendar } from './ui/calendar';
import { ja } from 'date-fns/locale';
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
    <Calendar
      onSelect={handleSelect}
      mode="single"
      disabled={dateCheck}
      selected={selectedDate ? stringToDate(selectedDate) : undefined}
      defaultMonth={selectedDate ? stringToDate(selectedDate) : undefined}
      locale={ja}
      className="border rounded-lg shadow-lg bg-white"
    />
  );
}
