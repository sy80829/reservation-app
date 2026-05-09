import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservationCardProps } from '@/types';

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
              時間：{time}({course.duration}分)
            </div>
            <div>コース：{course.name}</div>
            <div>スタイリスト：{stylist?.name ?? '指名なし'}</div>
            <div>金額：{course.price}円</div>
          </div>
        </CardHeader>
        {/* <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
      </Card>
    </div>
  );
}
