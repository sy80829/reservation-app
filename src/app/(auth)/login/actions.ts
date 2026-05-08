'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";


export async function login(
  next: string | undefined,
  formData: FormData
) {
  const redirectPath = next || '/top';
    //googleログイン
    //server.tsのcreateClient
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
  },
})

if (data.url) {
  redirect(data.url) // use the redirect API for your server framework
}
}