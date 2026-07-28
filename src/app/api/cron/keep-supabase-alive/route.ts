import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { error } = await createSupabaseAdminClient().from("orders").select("id", { head: true, count: "exact" });
    if (error) throw error;
    return Response.json({ ok: true, checkedAt: new Date().toISOString() });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
