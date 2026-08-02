import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getAuthEnvironment() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!url || !publishableKey || !adminEmail) return null;
  return { url, publishableKey, adminEmail };
}

export function isAdminAuthConfigured() {
  return getAuthEnvironment() !== null;
}

export async function createSupabaseAuthClient() {
  const environment = getAuthEnvironment();
  if (!environment) throw new Error("Admin authentication is not configured.");

  const cookieStore = await cookies();
  return createServerClient(environment.url, environment.publishableKey, {
    cookieOptions: {
      name: "padox-admin-auth",
      path: "/admin",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. src/proxy.ts handles refreshes.
        }
      },
    },
  });
}

export async function getAdminUser() {
  const environment = getAuthEnvironment();
  if (!environment) return null;

  const supabase = await createSupabaseAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email || user.email.toLowerCase() !== environment.adminEmail) return null;
  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
