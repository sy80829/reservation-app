'use client';

import { useSearchParams, useRouter, redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { reservAction } from '@/app/(private)/actions/reservAction';
import ReservationCard from '@/components/ReservationCard';
import { Course, ReservCompleteCardProps, Stylist } from '@/types';
import ReservCompleteCard from './ReservCompleteCard';

export default function Reservation() {
  console.log('ReservationClientにきました');
  const params = useSearchParams();
  const router = useRouter();
  const courseId = params.get('courseId');
  const stylistId =
    params.get('stylistId') === 'null' ? undefined : params.get('stylistId');
  const date = params.get('date');
  const time = params.get('time');
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

  useEffect(() => {
    if (courseId) {
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
    // router.push('/');
    return null;
  }

  if (!course) {
    return <p>読み込み中...</p>;
  }

  const handleClick = async () => {
    //　予約処理
    await reservAction({
      new_start: time + ':00',
      target_date: date,
      course_id: courseId,
      stylist_id: stylistId ?? null,
    });
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
              router.push(
                // `/top?courseId=${courseId}&stylistId=${stylistId}&date=${date}&time=${time}`,
                `/top`,
              );
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
