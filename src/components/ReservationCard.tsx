import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservationCardProps } from '@/types';

// "11:30" + 90分 → "13:00"
export function calculateEndTime(startTime: string, duration: number): string {
  const [hour, minute] = startTime.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + duration;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
}

export default function ReservationCard({
  course,
  stylist,
  date,
  time,
}: ReservationCardProps) {
  return (
    <div>
      <Card className="max-w-md mx-auto mt-12 mb-12">
        <CardHeader className="text-center space-y-2">
          <CardTitle>予約内容</CardTitle>
          <div className="mx-auto text-left space-y-1">
            <div>日付：{date}</div>
            <div>
              時間：{time}~{time && calculateEndTime(time, course.duration)}(
              {course.duration}分)
            </div>
            <div>コース：{course.name}</div>
            <div>スタイリスト：{stylist?.name ?? '指名なし'}</div>
            <div>金額：{course.price}円</div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
