'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservCompleteCardProps } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  reservDetails: ReservCompleteCardProps;
};

export default function ReservCompleteCard({ reservDetails }: Props) {
  const router = useRouter();
  return (
    <div>
      <img
        src="/images/11433360.png"
        width={80}
        height={80}
        className="mx-auto mt-5 mb-5"
      ></img>
      <p className="text-center text-2xl font-bold">予約が確定しました</p>
      <Card className="max-w-xs mx-auto mt-5 mb-5">
        <CardHeader className="text-center space-y-2">
          <CardTitle>予約内容</CardTitle>
          <div className="mx-auto text-left space-y-1">
            <div>日付：{reservDetails.reserv_date}</div>
            <div>
              時間：{reservDetails.reserv_time_st.slice(0, 5)}~
              {reservDetails.reserv_time_ed.slice(0, 5)}(
              {reservDetails.courses.duration}分)
            </div>
            <div>コース：{reservDetails.courses.name}</div>
            <div>スタイリスト：{reservDetails.stylists.name ?? '指名なし'}</div>
            <div>金額：{reservDetails.courses.price}円</div>
          </div>
        </CardHeader>
      </Card>
      <h2 className="text-center">
        ご登録のメールアドレスへ予約内容が送信されました。
      </h2>
      <h2 className="text-center">
        予約の変更は、トップ右上メニューの「予約確認ページ」から行えます。
      </h2>
      <div className="flex flex-col items-center mt-5">
        <button
          className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3"
          onClick={() => router.push('/reservation/confirm')}
        >
          予約確認ページへ
        </button>
        <button
          className="bg-[#F3F4F6] text-black hover:bg-[#e4d9d9] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3"
          onClick={() => router.push('/top')}
        >
          トップへ戻る
        </button>
      </div>
    </div>
  );
}
