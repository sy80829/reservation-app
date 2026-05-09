'use client';

import { useSearchParams, useRouter, redirect } from 'next/navigation';
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
      console.error('data.name:', data.stylist.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (editReservationData.courseId) {
      fetchCourse();
      if (editReservationData.stylistId) {
        fetchStylist();
      }
    }
  }, []);

  if (
    !editReservationData.courseId ||
    !editReservationData.date ||
    !editReservationData.time ||
    !id
  ) {
    console.log('courseId:', editReservationData.courseId);
    console.log('date:', editReservationData.date);
    console.log('time:', editReservationData.time);
    console.log('コースID、日付、時間がありません');
    router.push('/top?error=invalid_operation');
  }

  if (!course) {
    return <p>読み込み中...</p>;
  }

  const handleClick = async () => {
    console.log('editReservationData:', editReservationData);
    //　予約処理
    await updateRservation({
      reservationId: id,
      // new_start: time + ':00',
      // target_date: date,
      // course_id: courseId,
      // stylist_id: stylistId ?? null,
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
