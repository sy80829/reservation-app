'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { reservAction } from '@/app/(private)/actions/reservAction';
import ReservationCard from '@/components/ReservationCard';
import { Course, Stylist } from '@/types';
import { useNewReservationDataStore } from '@/atoms/newReservationDataState';

export default function Reservation() {
  const router = useRouter();
  const { newReservationData, setNewReservationData } =
    useNewReservationDataStore();
  const { courseId, stylistId, date, time } = newReservationData;
  const [course, setCourse] = useState<Course>();
  const [stylist, setStylist] = useState<Stylist>();
  //コース取得
  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/course?courseId=${courseId}`); //APIを呼び出す
      const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
      setCourse(data.course);
    } catch (error) {
      console.error(error);
    }
  };

  //スタイリスト取得
  const fetchStylist = async () => {
    try {
      const res = await fetch(`/api/stylist?stylistId=${stylistId}`); //APIを呼び出す
      const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
      setStylist(data.stylist);
      console.error('data.name:', data.stylist.name);
    } catch (error) {
      console.error(error);
    }
  };

  // setStateはfetch内のawait後（非同期）に呼ばれるため実質同期呼び出しではない
  useEffect(() => {
    if (courseId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCourse();
      if (stylistId) {
        fetchStylist();
      }
    }
  }, [courseId, stylistId]);

  if (!courseId || !date || !time) {
    console.log('courseId:', courseId);
    console.log('date:', date);
    console.log('time:', time);
    console.log('コースID、日付、時間がありません');
    return null;
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
    // 送信後は不要になるのでドラフトをクリア
    setNewReservationData({
      courseId: null,
      stylistId: null,
      date: null,
      time: null,
    });

    //　予約処理
    const result = await reservAction({
      new_start: time + ':00',
      target_date: date,
      course_id: courseId,
      stylist_id: stylistId ?? null,
    });

    if (result) {
      router.push(`/top?error=${result}`);
    }
  };

  return (
    <div>
      <div>
        <ReservationCard
          course={course}
          stylist={stylist}
          date={date}
          time={time}
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
          予約を確定する
        </button>
        <button
          onClick={() => {
            {
              router.push(`/top`);
            }
          }}
          className="bg-[#22C55E] text-white hover:bg-[#1fb456] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl"
        >
          予約を変更する
        </button>
      </div>
    </div>
  );
}
