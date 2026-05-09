// app/reservation/page.tsx（← "use client" 消す）
'use server';

import { userCheck } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';
import ReservationClient from '@/components/ReservationClient';
import { createClient } from '@/lib/supabase/server';
import UpdateReservationClient from '@/components/UpdateReservationClient';

export default async function Page({
  params,
  // searchParams,
}: {
  params: { id: string };
  // searchParams: {
  //   courseId: string;
  //   stylistId: string | undefined;
  //   date: string;
  //   time: string;
  // };
}) {
  // console.log('🔥 FULL URL PARAMS:', searchParams);
  // const user = await userCheck();

  // const reservationSearchParams = await searchParams;
  const reservationParams = await params;

  // console.log('searchParams.courseId:', reservationSearchParams.courseId);
  // console.log('searchParams.stylistId:', reservationSearchParams.stylistId);
  // console.log('searchParams.date:', reservationSearchParams.date);
  // console.log('searchParams.time:', reservationSearchParams.time);

  let currentPath = '';

  // if (reservationSearchParams.stylistId) {
  //   currentPath = `/updateReservation?id=${reservationParams.id}&courseId=${reservationSearchParams.courseId}&stylistId=${reservationSearchParams.stylistId}&date=${reservationSearchParams.date}&time=${reservationSearchParams.time}`;
  // } else {
  //   currentPath = `/updateReservation?id=${reservationParams.id}&courseId=${reservationSearchParams.courseId}&date=${reservationSearchParams.date}&time=${reservationSearchParams.time}`;
  // }

  currentPath = `/updateReservation?id=${reservationParams.id}`;

  // 未登録なら登録へ
  // if (!user) {
  //   console.log('未登録です');
  //   //会員登録後、元の予約ページに戻る
  //   redirect(`/registerUser?next=${encodeURIComponent(currentPath)}`);
  // }

  console.log('戻ります');

  return <UpdateReservationClient id={reservationParams.id} />;
}
