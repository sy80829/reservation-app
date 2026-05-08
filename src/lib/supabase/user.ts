"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function userCheck() {
    const supabase = await createClient()
    const user = (await supabase.auth.getUser()).data.user;

    if(!user ) {
        redirect("/login");
        console.log("ログインページへ");
    }

    try{
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
    
        console.log("users.のdata:", data);

    
    if(error){
        console.log('user取得エラー:', error);

        // 未登録
      if (error.code === 'PGRST116') {
        // userが存在しない
        return null;
      }

      // それ以外（DBエラーなど）
      throw error;
    }
    
    return data;

    } catch ( e ) { 
        console.error('致命的エラー:', e);
        redirect('/error') // or fallback
    }   
    
}