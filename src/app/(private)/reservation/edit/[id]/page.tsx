'use server';

import TopPage from '@/components/Top';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const idNum = Number(id);
  //ログインチェック
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const user_id = user.id;
  const today = new Date().toLocaleDateString('sv-SE');

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select(
      `
        id,
        reserv_date,
        reserv_time_st,
        reserv_time_ed,
        version,
        is_free,
        courses (
          id,
          name
        ),
        stylists (
          id,
          name
        )
      `,
    )
    .eq('id', idNum)
    .eq('user_id', user_id)
    .gte('reserv_date', today)
    .single();

  if (!reservation || error) {
    redirect('/top');
  }

  return <TopPage reservation={reservation} mode="edit" />;
}
