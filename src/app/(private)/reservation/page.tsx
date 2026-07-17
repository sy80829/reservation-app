'use server';

import { userCheck } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';
import ReservationClient from '@/components/ReservationClient';

export default async function Page() {
  const user = await userCheck();

  // 未登録なら登録へ（選択内容はAtom(localStorage)に残っているのでクエリで引き回す必要はない）
  if (!user) {
    redirect(`/registerUser?next=${encodeURIComponent('/reservation')}`);
  }

  return <ReservationClient />;
}
