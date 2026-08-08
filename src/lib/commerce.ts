import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type VoucherResult = { id: string; code: string; discountAmount: number };

export async function validateVoucher(code: string | undefined, packageId: string, price: number, phone?: string): Promise<VoucherResult | null> {
  if (!code?.trim()) return null;
  const normalized = code.trim().toUpperCase();
  const db = createSupabaseAdminClient();
  const { data } = await db.from("vouchers").select("id,code,discount_type,discount_value,minimum_spend,package_ids,starts_at,ends_at,usage_limit,per_customer_limit,active").eq("code", normalized).maybeSingle();
  if (!data || !data.active) throw new Error("Kod voucher tidak sah atau tidak aktif.");
  const now = Date.now();
  if ((data.starts_at && new Date(data.starts_at).getTime() > now) || (data.ends_at && new Date(data.ends_at).getTime() < now)) throw new Error("Kod voucher belum bermula atau telah tamat.");
  if (price < Number(data.minimum_spend) || (data.package_ids?.length && !data.package_ids.includes(packageId))) throw new Error("Voucher ini tidak layak untuk pakej yang dipilih.");
  if (data.usage_limit) { const { count } = await db.from("orders").select("id", { count: "exact", head: true }).eq("voucher_id", data.id).eq("status", "Paid"); if ((count || 0) >= data.usage_limit) throw new Error("Had penggunaan voucher telah dicapai."); }
  if (phone && data.per_customer_limit) { const clean = phone.replace(/[\s-]/g, ""); const { count } = await db.from("orders").select("id", { count: "exact", head: true }).eq("voucher_id", data.id).eq("phone", clean).eq("status", "Paid"); if ((count || 0) >= data.per_customer_limit) throw new Error("Voucher ini telah mencapai had penggunaan anda."); }
  const raw = data.discount_type === "percent" ? price * Number(data.discount_value) / 100 : Number(data.discount_value);
  return { id: data.id, code: data.code, discountAmount: Math.min(price, Math.round(raw * 100) / 100) };
}

export async function getAffiliate(code?: string) {
  if (!code) return null;
  const { data } = await createSupabaseAdminClient().from("affiliates").select("id,code,commission_rate").eq("code", code.toUpperCase()).eq("active", true).maybeSingle();
  return data;
}
