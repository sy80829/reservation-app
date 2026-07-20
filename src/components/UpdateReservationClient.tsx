'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReservationCard from '@/components/ReservationCard';
import { Course, Stylist } from '@/types';
import { updateRservation } from '@/app/(private)/actions/updateReservation';
import { useEditReservationDataStore } from '@/atoms/editReservationDataState';

export default function UpdateReservationClient({ id }: { id: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course>();
  const [stylist, setStylist] = useState<Stylist>();
  const { editReservationData } = useEditReservationDataStore();

  // editReservationDataはマウント時点の値だけ使えばよいので依存配列は空でよい
  useEffect(() => {
    //UI表示用　コース取得
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `/api/course?courseId=${editReservationData.courseId}`,
        ); //APIを呼び出す
        const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
        setCourse(data.course);
      } catch (error) {
        console.error(error);
      }
    };

    //UI表示用　スタイリスト取得
    const fetchStylist = async () => {
      try {
        const res = await fetch(
          `/api/stylist?stylistId=${editReservationData.stylistId}`,
        ); //APIを呼び出す
        const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
        setStylist(data.stylist);
      } catch (error) {
        console.error(error);
      }
    };

    if (editReservationData.courseId) {
      fetchCourse();
      if (editReservationData.stylistId) {
        fetchStylist();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !editReservationData.courseId ||
    !editReservationData.date ||
    !editReservationData.time ||
    !id
  ) {
    router.push('/top?error=invalid_operation');
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto mt-12 mb-12 animate-pulse rounded-lg border p-6">
        <div className="h-5 w-24 rounded bg-gray-200 mx-auto mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  const handleClick = async () => {
    //　予約処理
    await updateRservation({
      reservationId: id,
      editReservationData,
    });
  };

  return (
    <div>
      <div>
        <ReservationCard
          course={course}
          stylist={stylist}
          date={editReservationData.date}
          time={editReservationData.time}
        />
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <button
          onClick={() => {
            {
              handleClick();
            }
          }}
          className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3"
        >
          変更を確定する
        </button>
        <button
          onClick={() => {
            {
              router.push(`/top`);
            }
          }}
          className="bg-[#22C55E] text-white hover:bg-[#1fb456] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl"
        >
          変更をキャンセル
        </button>
      </div>
    </div>
  );
}
