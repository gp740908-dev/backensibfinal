import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // ROUTE PROTECTION
    const path = request.nextUrl.pathname;

    // 1. If user is NOT logged in and trying to access dashboard
    if (!user && path.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = '/'; // Redirect to login
        return NextResponse.redirect(url);
    }

    // 2. If user IS logged in and trying to access login page
    if (user && path === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response
}
