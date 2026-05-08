'use server';

import ReservCompleteCard from '@/components/ReservCompleteCard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const supabase = await createClient();
  // console.log('params:', params);
  const { id } = await params;
  const numId = Number(id);
  console.log('予約データid', id);
  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
    reserv_date,
    reserv_time_st,
    reserv_time_ed,
    courses (
      name,
      duration,
      price
    ),
    stylists (
      name
    )
  `,
    )
    .eq('id', numId)
    .single();

  if (error || !data) {
    console.log('エラー', error.message);
    redirect('/top');
  }

  return <ReservCompleteCard reservDetails={data} />;
}
