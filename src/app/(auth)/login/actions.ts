'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";


export async function login(
  formData: FormData
) {
  const redirectTo = formData.get('redirectTo') as string
    const supabase = await createClient();
    const { data } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo:
`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirectTo=${encodeURIComponent(redirectTo ?? '/top')}`,
  },
})

if (data.url) {
  redirect(data.url) // use the redirect API for your server framework
}
}