'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { confirmReservationProps, ReservCompleteCardProps } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CancelReservationModal from './CancelReservationModal';
import { useEditReservationDataStore } from '@/atoms/editReservationDataState';

export default function ReservationConfirmPage({
  reservDetails,
}: {
  reservDetails: confirmReservationProps;
}) {
  const router = useRouter();
  const handleClick = () => {
    console.log('あああ');
    router.push(`/reservation/edit/${reservDetails.id}`);
  };
  if (!reservDetails) {
    return <p className="text-center mt-5">予約がありません。</p>;
  }
  return (
    <div>
      <p className="text-center text-2xl font-bold mt-5">予約確認ページ</p>
      <Card className="max-w-xs mx-auto mt-5 mb-5">
        <CardHeader className="text-center space-y-2">
          <CardTitle>予約内容</CardTitle>
          <div className="mx-auto text-left space-y-1">
            <div>日付：{reservDetails.reserv_date}</div>
            <div>
              時間：{reservDetails.reserv_time_st}~
              {reservDetails.reserv_time_ed}({reservDetails.courses.duration}分)
            </div>
            <div>コース：{reservDetails.courses.name}</div>
            <div>スタイリスト：{reservDetails.stylists.name ?? '指名なし'}</div>
            <div>金額：{reservDetails.courses.price}円</div>
          </div>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center mt-5">
        <button
          onClick={() => handleClick()}
          className="bg-[#22C55E] text-white hover:bg-[#1eb856] transition cursor-pointer w-43 md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3 shadow"
        >
          予約を変更する
        </button>
        {/* 予約キャンセル */}
        <CancelReservationModal
          id={reservDetails.id}
          version={reservDetails.version}
        />
      </div>
    </div>
  );
}
