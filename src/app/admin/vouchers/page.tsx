import { requireAdminUser } from "@/lib/supabase/auth-server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { monthRange } from "@/lib/affiliate-data";
import { packages } from "@/data/packages";
import { AdminNav } from "@/components/AdminNav";
import { AdminTopbar } from "@/components/AdminTopbar";
import { saveVoucher, toggleVoucher } from "../management-actions";

type Voucher = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  minimum_spend: number;
  package_ids: string[];
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  per_customer_limit: number | null;
  active: boolean;
};

const dateTimeValue = (value: string | null | undefined) => value ? new Date(value).toISOString().slice(0, 16) : "";

export default async function Page({ searchParams }: { searchParams: Promise<{ month?: string; error?: string }> }) {
  const user = await requireAdminUser();
  const query = await searchParams;
  const range = monthRange(query.month);
  const db = createSupabaseAdminClient();
  const { data: vouchers } = await db.from("vouchers").select("*").order("created_at", { ascending: false });
  let ordersQuery = db.from("orders").select("voucher_id,discount_amount").eq("status", "Paid").not("voucher_id", "is", null);
  if (range) ordersQuery = ordersQuery.gte("paid_at", range.from).lt("paid_at", range.to);
  const { data: usage } = await ordersQuery;

  return (
    <main className="admin-dashboard-shell">
      <AdminTopbar email={user.email || ""} section="Admin Voucher" />
      <div className="admin-dashboard">
        <AdminNav />
        <section className="admin-heading">
          <div><p className="admin-kicker">PENGURUSAN VOUCHER</p><h1>Senarai Voucher</h1><p>Cipta voucher dan pantau penggunaannya dalam setiap bulan.</p></div>
          <div className="admin-stat"><strong>{(vouchers || []).filter((voucher) => voucher.active).length}</strong><span>voucher aktif</span></div>
        </section>
        <form className="admin-search">
          <label htmlFor="voucher-month">Tapis mengikut bulan</label>
          <div><input id="voucher-month" name="month" type="month" defaultValue={query.month || ""} /><button>Tapis</button>{query.month ? <a href="/admin/vouchers">Reset</a> : null}</div>
        </form>
        {query.error ? <p className="admin-alert">Voucher tidak dapat disimpan. Semak tetapan.</p> : null}
        <section className="admin-orders-card">
          <details className="admin-create"><summary>+ Tambah voucher baharu</summary><VoucherForm /></details>
          <div className="admin-table-heading"><span>{vouchers?.length || 0} voucher</span><small>Voucher aktif boleh digunakan semasa checkout</small></div>
          {vouchers?.length ? (
            <div className="voucher-list">
              {vouchers.map((voucher: Voucher) => {
                const voucherUsage = (usage || []).filter((order) => order.voucher_id === voucher.id);
                const totalDiscount = voucherUsage.reduce((sum, order) => sum + Number(order.discount_amount), 0);
                return (
                  <article className="voucher-item" key={voucher.id}>
                    <details className="voucher-details">
                      <summary className="voucher-summary">
                        <div><strong>{voucher.code}</strong><span>{voucher.discount_type === "percent" ? `${voucher.discount_value}%` : `RM ${Number(voucher.discount_value).toFixed(2)}`} diskaun</span><small>Minimum RM {Number(voucher.minimum_spend).toFixed(2)}</small></div>
                        <div><span>Penggunaan</span><strong>{voucherUsage.length}{voucher.usage_limit ? ` / ${voucher.usage_limit}` : ""}</strong><small>RM {totalDiscount.toFixed(2)} diberi</small></div>
                        <div><span className={`status-chip ${voucher.active ? "on" : "off"}`}>{voucher.active ? "Aktif" : "Tidak aktif"}</span><small>{voucher.package_ids.length ? `${voucher.package_ids.length} package` : "Semua package"}</small></div>
                        <span className="voucher-edit-label">Edit voucher</span>
                      </summary>
                      <div className="voucher-editor">
                        <VoucherForm voucher={voucher} />
                        <form className="voucher-status-action" action={toggleVoucher}>
                          <input type="hidden" name="id" value={voucher.id} />
                          <input type="hidden" name="active" value={String(voucher.active)} />
                          <button className="muted-action">{voucher.active ? "Deactivate" : "Aktifkan"}</button>
                        </form>
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          ) : <div className="admin-empty"><strong>Belum ada voucher</strong><p>Tambah voucher pertama menggunakan butang di atas.</p></div>}
        </section>
      </div>
    </main>
  );
}

function VoucherForm({ voucher }: { voucher?: Voucher }) {
  return (
    <form action={saveVoucher} className="admin-management-form">
      {voucher ? <input type="hidden" name="id" value={voucher.id} /> : null}
      <Field label="Kod"><input name="code" defaultValue={voucher?.code} required /></Field>
      <Field label="Jenis"><select name="type" defaultValue={voucher?.discount_type || "percent"}><option value="percent">Peratus (%)</option><option value="fixed">Nilai tetap (RM)</option></select></Field>
      <Field label="Nilai"><input name="value" type="number" step=".01" defaultValue={voucher?.discount_value} required /></Field>
      <Field label="Minimum belian"><input name="minimum" type="number" step=".01" defaultValue={voucher?.minimum_spend || 0} /></Field>
      <Field label="Tarikh mula"><input name="startsAt" type="datetime-local" defaultValue={dateTimeValue(voucher?.starts_at)} /></Field>
      <Field label="Tarikh tamat"><input name="endsAt" type="datetime-local" defaultValue={dateTimeValue(voucher?.ends_at)} /></Field>
      <Field label="Had keseluruhan"><input name="usageLimit" type="number" placeholder="Tiada had" defaultValue={voucher?.usage_limit || ""} /></Field>
      <Field label="Had pelanggan"><input name="customerLimit" type="number" placeholder="Tiada had" defaultValue={voucher?.per_customer_limit || ""} /></Field>
      <fieldset><legend>Package layak</legend>{packages.map((item) => <label key={item.id}><input type="checkbox" name="packages" value={item.id} defaultChecked={voucher?.package_ids?.includes(item.id)} /> Package {item.quantity}</label>)}</fieldset>
      <label className="check-label"><input type="checkbox" name="active" defaultChecked={voucher?.active ?? true} /> Aktif</label>
      <button>Simpan voucher</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span>{label}</span>{children}</label>;
}
