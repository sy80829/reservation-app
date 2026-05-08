// app/reservation/page.tsx（← "use client" 消す）
'use server';

import { userCheck } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';
import ReservationClient from '@/components/ReservationClient';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    courseId: string;
    stylistId: string | undefined;
    date: string;
    time: string;
  };
}) {
  console.log('🔥 FULL URL PARAMS:', searchParams);
  const user = await userCheck();

  const params = await searchParams;

  console.log('searchParams.courseId:', params.courseId);
  console.log('searchParams.stylistId:', params.stylistId);
  console.log('searchParams.date:', params.date);
  console.log('searchParams.time:', params.time);

  let currentPath = '';

  if (params.stylistId) {
    currentPath = `/reservation?courseId=${params.courseId}&stylistId=${params.stylistId}&date=${params.date}&time=${params.time}`;
  } else {
    currentPath = `/reservation?courseId=${params.courseId}&date=${params.date}&time=${params.time}`;
  }

  // 未登録なら登録へ
  if (!user) {
    console.log('未登録です');
    //会員登録後、元の予約ページに戻る
    redirect(`/registerUser?next=${encodeURIComponent(currentPath)}`);
  }

  console.log('戻ります');

  return <ReservationClient />;
}
