import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

//ブラウザからリクエストがあったときに一番最初に呼ばれる（入口みたいな感じ）
//認証機能の確認、ユーザーがログインしているかを確認
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}