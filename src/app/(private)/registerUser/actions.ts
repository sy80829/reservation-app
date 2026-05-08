'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const supabase = await createClient();
  const next = formData.get('next') as string;

  console.log("next:", next);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("ログインページへ");
    redirect('/login');
    
  }

  const { data, error } = await supabase.from('users').insert([{
    id: user.id!,
    name: formData.get('name') as string,
    tel: formData.get('tel') as string,
    is_delete: 0,
  }])
  .select();

  console.log('data:', data);
  console.error('error:', error);

  // 元のページにリダイレクト
  if (!error) {
      if (next?.startsWith('/')) {
        console.log("リダイレクト");
      redirect(next);
    } else {
      redirect('/');
    }
  }
}