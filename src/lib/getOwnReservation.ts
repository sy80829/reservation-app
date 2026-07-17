'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getOwnReservation<T = any>(
  id: number,
  selectQuery: string,
  modify?: (query: any) => any,
): Promise<T> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  let query = supabase
    .from('reservations')
    .select(selectQuery)
    .eq('id', id)
    .eq('user_id', user.id);

  if (modify) {
    query = modify(query);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    redirect('/top');
  }

  return data as T;
}
