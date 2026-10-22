import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
       setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      const login = new URL('/admin/login', request.url);
      login.searchParams.set('next', path);
      return NextResponse.redirect(login);
    }
    // Double-check admin status (admins table OR ADMIN_EMAIL env)
    const { data: adminRow } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
    const emailMatch =
      !!process.env.ADMIN_EMAIL && !!user.email &&
      user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    if (!adminRow && !emailMatch) {
      return NextResponse.redirect(new URL('/admin/login?error=not-admin', request.url));
    }
  }

  return response;
}

export const config = { matcher: ['/admin/:path*'] };
