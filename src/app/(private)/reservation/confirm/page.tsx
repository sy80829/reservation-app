'use server';

import ReservationConfirm from '@/components/ReservationConfirm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('ユーザー取得失敗');
  }

  const user_id = user.id;
  const today = new Date().toLocaleDateString('sv-SE');

  //予約確認ページに表示するデータを取得
  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
    id,
    reserv_date,
    reserv_time_st,
    reserv_time_ed,
    version,
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
    .eq('user_id', user_id)
    .eq('is_canceled', false)
    .gte('reserv_date', today)
    .maybeSingle();

  console.log('data:', data);
  console.log('error:', error);

  if (error) {
    console.log('エラー', error.message);
    redirect('/top');
  }

  if (!data) {
    return <p className="text-center mt-5">予約がありません。</p>;
  }

  return <ReservationConfirm reservDetails={data} />;
}
