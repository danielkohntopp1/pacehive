import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname + request.nextUrl.search

  const ADMIN_EMAIL = 'danielkohntopp@gmail.com'
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  const protectedPaths = ['/dashboard', '/guia', '/cadastro/guia', '/admin']
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (isProtected && !user) {
    // /cadastro/guia requires a runner account first — send to signup with guide intent
    if (request.nextUrl.pathname.startsWith('/cadastro/guia')) {
      return NextResponse.redirect(new URL('/cadastro?guide=true', request.url))
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/login', '/cadastro']
  const isAuthPage = authPaths.some(p => request.nextUrl.pathname === p)
  if (isAuthPage && user) {
    // If the user is trying to become a guide, send them straight to /cadastro/guia
    if (request.nextUrl.pathname === '/cadastro' && request.nextUrl.searchParams.get('guide') === 'true') {
      return NextResponse.redirect(new URL('/cadastro/guia', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
