import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const referral = request.nextUrl.searchParams.get("ref")?.trim().toUpperCase();
  if (referral && /^[A-Z0-9_-]{3,30}$/.test(referral)) response.cookies.set("padox-affiliate", referral, { path: "/", maxAge: 30 * 24 * 60 * 60, sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !publishableKey) return response;

  const supabase = createServerClient(url, publishableKey, {
    cookieOptions: {
      name: request.nextUrl.pathname.startsWith("/affiliate") ? "padox-affiliate-auth" : "padox-admin-auth",
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/payment/callback).*)"],
};
