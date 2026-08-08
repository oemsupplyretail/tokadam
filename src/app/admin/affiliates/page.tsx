import { requireAdminUser } from "@/lib/supabase/auth-server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { monthRange } from "@/lib/affiliate-data";
import { AdminNav } from "@/components/AdminNav";
import { AdminTopbar } from "@/components/AdminTopbar";
import { createAffiliate, resetAffiliatePassword, settleAffiliate, toggleAffiliate } from "../management-actions";

const rm = (value: number) => `RM ${value.toFixed(2)}`;
const displayValue = (value: string | null | undefined) => value?.trim() || "Belum diisi";

export default async function Page({ searchParams }: { searchParams: Promise<{ month?: string; error?: string; success?: string }> }) {
  const user = await requireAdminUser();
  const query = await searchParams;
  const range = monthRange(query.month);
  const db = createSupabaseAdminClient();
  const { data: affiliates } = await db.from("affiliates").select("*").order("created_at");
  let ordersQuery = db.from("orders").select("affiliate_id,commission_amount,commission_settlement_id").eq("status", "Paid");
  if (range) ordersQuery = ordersQuery.gte("paid_at", range.from).lt("paid_at", range.to);
  let settlementsQuery = db.from("commission_settlements").select("affiliate_id,amount");
  if (range) settlementsQuery = settlementsQuery.gte("settled_at", range.from).lt("settled_at", range.to);
  const [{ data: orders }, { data: settlements }] = await Promise.all([ordersQuery, settlementsQuery]);
  const rows = (affiliates || []).map((affiliate) => ({
    affiliate,
    pending: (orders || []).filter((order) => order.affiliate_id === affiliate.id && !order.commission_settlement_id).reduce((sum, order) => sum + Number(order.commission_amount), 0),
    settled: (settlements || []).filter((settlement) => settlement.affiliate_id === affiliate.id).reduce((sum, settlement) => sum + Number(settlement.amount), 0),
  }));

  return (
    <main className="admin-dashboard-shell">
      <AdminTopbar email={user.email || ""} section="Admin Affiliate" />
      <div className="admin-dashboard">
        <AdminNav />
        <section className="admin-heading">
          <div><p className="admin-kicker">PENGURUSAN AFFILIATE</p><h1>Senarai Affiliate</h1><p>Tambah affiliate, semak komisen dan rekod settlement.</p></div>
          <div className="admin-stat"><strong>{rows.filter(({ affiliate }) => affiliate.active).length}</strong><span>affiliate aktif</span></div>
        </section>
        <form className="admin-search">
          <label htmlFor="affiliate-month">Tapis mengikut bulan</label>
          <div><input id="affiliate-month" name="month" type="month" defaultValue={query.month || ""} /><button>Tapis</button>{query.month ? <a href="/admin/affiliates">Reset</a> : null}</div>
        </form>
        {query.error ? <p className="admin-alert">Tindakan gagal. Semak maklumat dan cuba semula.</p> : null}
        <section className="admin-orders-card">
          <details className="admin-create">
            <summary>+ Tambah affiliate baharu</summary>
            <form action={createAffiliate} className="admin-management-form">
              <Field label="Nama penuh"><input name="name" required /></Field>
              <Field label="Email login"><input name="email" type="email" required /></Field>
              <Field label="Nombor telefon"><input name="phone" required /></Field>
              <Field label="Kod affiliate"><input name="code" placeholder="Auto jika kosong" /></Field>
              <Field label="Komisen (%)"><input name="rate" type="number" defaultValue="10" step=".01" /></Field>
              <Field label="Password"><input name="password" type="password" minLength={8} required /></Field>
              <button>Cipta affiliate</button>
            </form>
          </details>
          <div className="admin-table-heading"><span>{rows.length} affiliate</span><small>Admin sahaja boleh menetapkan password dan settlement</small></div>
          {rows.length ? (
            <div className="admin-order-list">
              {rows.map(({ affiliate, pending, settled }) => (
                <article className="affiliate-row" key={affiliate.id}>
                  <div><strong>{affiliate.name}</strong><span>{affiliate.email}</span><small>{affiliate.code} · {affiliate.commission_rate}% komisen</small></div>
                  <div><span>Pending</span><strong>{rm(pending)}</strong><small>Settled {rm(settled)}</small></div>
                  <form action={settleAffiliate}><input type="hidden" name="id" value={affiliate.id} /><input name="reference" placeholder="Settlement reference" /><button disabled={!pending}>Settle</button></form>
                  <details>
                    <summary>Urus akaun</summary>
                    <div className="affiliate-payout-details">
                      <strong>Maklumat pembayaran</strong>
                      <dl>
                        <div><dt>Nombor telefon</dt><dd>{displayValue(affiliate.phone)}</dd></div>
                        <div><dt>Nama bank</dt><dd>{displayValue(affiliate.bank_name)}</dd></div>
                        <div><dt>Nombor akaun</dt><dd>{displayValue(affiliate.bank_account)}</dd></div>
                      </dl>
                    </div>
                    <form className="affiliate-password-form" action={resetAffiliatePassword}>
                      <input type="hidden" name="userId" value={affiliate.auth_user_id} />
                      <input name="password" type="password" minLength={8} placeholder="Password baharu" required />
                      <button>Set password</button>
                    </form>
                    <form className="affiliate-status-form" action={toggleAffiliate}>
                      <input type="hidden" name="id" value={affiliate.id} />
                      <input type="hidden" name="active" value={String(affiliate.active)} />
                      <button className="muted-action">{affiliate.active ? "Deactivate" : "Aktifkan"}</button>
                    </form>
                  </details>
                </article>
              ))}
            </div>
          ) : <div className="admin-empty"><strong>Belum ada affiliate</strong><p>Tambah affiliate pertama menggunakan butang di atas.</p></div>}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span>{label}</span>{children}</label>;
}
