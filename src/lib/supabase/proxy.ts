import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { userCheck } from './user'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  const protectedPaths = ['/reservation']
  const registerPaths = ['/registerUser']

  const isProtected = protectedPaths.some(path =>
  request.nextUrl.pathname.startsWith(path)
  )

  const isRegisterPage =
  registerPaths.some(path =>
  request.nextUrl.pathname.startsWith(path)
  )

  //未ログイン
  if (!user && isProtected) {
    const url = request.nextUrl.clone()

    url.pathname = '/login'

    url.searchParams.set(
      'redirectTo',
      request.nextUrl.pathname +
        request.nextUrl.search
    )

    return NextResponse.redirect(url)
  }

  // ログイン済みの場合、会員登録チェックをする
  if (
    user &&
    isProtected &&
    !isRegisterPage
  ) {
    const isRegistered =
      await userCheck()

    if (!isRegistered) {
      const url =
        request.nextUrl.clone()

      url.pathname =
        '/registerUser'

      url.searchParams.set(
        'redirectTo',
        request.nextUrl.pathname +
          request.nextUrl.search
      )

      return NextResponse.redirect(url)
    }
  }



  // //リダイレクト
  // if (!user && isProtected && !isRegisterPage) {
  //   const isRegistered = await userCheck()
  //   const url = request.nextUrl.clone()
  //   // url.pathname = '/login'
  //   // return NextResponse.redirect(url)
  //   if (!isRegistered) {
  //     const url =request.nextUrl.clone()
  //     url.pathname ='/registerUser'
  //     url.searchParams.set(
  //     'redirectTo',
  //     request.nextUrl.pathname + request.nextUrl.search
  //     )

  //     return NextResponse.redirect(url)
  //   }
  //   url.pathname = '/login'
  //   url.searchParams.set(
  //   'redirectTo',
  //   request.nextUrl.pathname + request.nextUrl.search
  //   )
  //   console.log("リダイレクトurl:",url);
  //   return NextResponse.redirect(url)
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}