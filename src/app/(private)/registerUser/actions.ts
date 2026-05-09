'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const supabase = await createClient();
  const redirectTo = formData.get('redirectTo') as string;

  console.log("next:", redirectTo);

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
      if (redirectTo?.startsWith('/')) {
        console.log("リダイレクト");
      redirect(redirectTo);
    } else {
      redirect('/');
    }
  }
}