'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const registerUserSchema = z.object({
  name: z.string().trim().min(1, 'name_required').max(50, 'name_too_long'),
  tel: z.string().trim().regex(/^0\d{9,10}$/, 'tel_invalid'),
});

export async function registerUser(formData: FormData) {
  const supabase = await createClient();
  const redirectTo = (formData.get('redirectTo') as string) ?? '';

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name = (formData.get('name') as string) ?? '';
  const tel = ((formData.get('tel') as string) ?? '').replace(/[-\s]/g, '');

  const parsed = registerUserSchema.safeParse({ name, tel });

  if (!parsed.success) {
    const errorCode = parsed.error.issues[0]?.message ?? 'invalid_input';
    redirect(
      `/registerUser?error=${errorCode}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  const { error } = await supabase
    .from('users')
    .insert([
      {
        id: user.id!,
        name: parsed.data.name,
        tel: parsed.data.tel,
        is_delete: 0,
      },
    ])
    .select();

  if (error) {
    redirect(
      `/registerUser?error=db_error&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  // 元のページにリダイレクト
  if (redirectTo.startsWith('/')) {
    redirect(redirectTo);
  } else {
    redirect('/');
  }
}
