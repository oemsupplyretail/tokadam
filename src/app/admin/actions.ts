"use server";

import { createSupabaseAuthClient, isAdminAuthConfigured } from "@/lib/supabase/auth-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  if (!isAdminAuthConfigured()) redirect("/admin/login?error=config");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email || !password || !allowedEmail || email !== allowedEmail) {
    redirect("/admin/login?error=credentials");
  }

  const supabase = await createSupabaseAuthClient();
  let signInFailed = false;
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    signInFailed = Boolean(error);
  } catch {
    redirect("/admin/login?error=service");
  }
  if (signInFailed) redirect("/admin/login?error=credentials");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== allowedEmail) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=credentials");
  }

  redirect("/admin/orders");
}

export async function logoutAdmin() {
  if (isAdminAuthConfigured()) {
    const supabase = await createSupabaseAuthClient();
    try {
      await supabase.auth.signOut();
    } catch {
      // Local cookies are cleared below even if the remote sign-out is unavailable.
    }
  }

  const cookieStore = await cookies();
  cookieStore.getAll()
    .filter(({ name }) => name.startsWith("padox-admin-auth"))
    .forEach(({ name }) => cookieStore.delete(name));
  redirect("/admin/login");
}
