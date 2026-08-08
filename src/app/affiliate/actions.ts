"use server";
import { createSupabaseAuthClient, requireAffiliateUser } from "@/lib/supabase/auth-server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAffiliate(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const auth = await createSupabaseAuthClient("affiliate");
  const { error } = await auth.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/affiliate/login?error=credentials");
  }
  const { data: { user } } = await auth.auth.getUser();
  const { data } = await createSupabaseAdminClient().from("affiliates").select("id").eq("auth_user_id", user?.id || "").eq("active", true).maybeSingle();
  if (!data) { await auth.auth.signOut(); redirect("/affiliate/login?error=access"); }
  redirect("/affiliate/dashboard");
}

export async function logoutAffiliate() {
  const auth = await createSupabaseAuthClient("affiliate");
  await auth.auth.signOut();
  redirect("/affiliate/login");
}

export async function updateAffiliateProfile(formData: FormData) {
  const { affiliate } = await requireAffiliateUser();
  const values = { name: String(formData.get("name") || "").trim(), phone: String(formData.get("phone") || "").trim(), bank_name: String(formData.get("bankName") || "").trim(), bank_account: String(formData.get("bankAccount") || "").trim(), updated_at: new Date().toISOString() };
  if (!values.name || !values.phone) throw new Error("Nama dan telefon diperlukan.");
  const { error } = await createSupabaseAdminClient().from("affiliates").update(values).eq("id", affiliate.id);
  if (error) throw new Error("Profil tidak dapat dikemas kini.");
  redirect("/affiliate/dashboard?saved=1");
}
