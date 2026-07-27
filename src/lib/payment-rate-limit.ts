import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export async function enforcePaymentRateLimit(ipAddress: string) {
  const key = createHash("sha256").update(ipAddress).digest("hex");
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("payment_rate_limits").select("request_count,window_started_at").eq("key", key).maybeSingle();
  if (error) throw new Error("Unable to verify payment request limit.");
  const now = new Date();
  if (!data) {
    const { error: insertError } = await supabase.from("payment_rate_limits").insert({ key, request_count: 1, window_started_at: now.toISOString(), updated_at: now.toISOString() });
    if (insertError) throw new Error("Unable to record payment request limit.");
    return;
  }
  const windowStartedAt = new Date(data.window_started_at);
  const isNewWindow = now.getTime() - windowStartedAt.getTime() >= WINDOW_MS;
  if (!isNewWindow && data.request_count >= MAX_REQUESTS) throw new Error("Too many payment attempts. Please wait one minute before trying again.");
  const { error: updateError } = await supabase.from("payment_rate_limits").update({ request_count: isNewWindow ? 1 : data.request_count + 1, window_started_at: isNewWindow ? now.toISOString() : data.window_started_at, updated_at: now.toISOString() }).eq("key", key);
  if (updateError) throw new Error("Unable to update payment request limit.");
}
