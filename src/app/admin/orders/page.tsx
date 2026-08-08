import Link from "next/link";
import { getPaidOrders } from "@/lib/orders";
import { requireAdminUser } from "@/lib/supabase/auth-server";
import { logoutAdmin } from "../actions";
import { AdminNav } from "@/components/AdminNav";

type OrdersPageProps = {
  searchParams: Promise<{ q?: string; month?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("ms-MY", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function matchesQuery(order: Awaited<ReturnType<typeof getPaidOrders>>[number], query: string) {
  const searchable = [order.id, order.customerName, order.phone, order.packageName, order.city, order.state, order.paymentReference].join(" ").toLowerCase();
  return searchable.includes(query);
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const user = await requireAdminUser();
  const [orders, { q, month }] = await Promise.all([getPaidOrders(), searchParams]);
  const query = q?.trim().toLowerCase() || "";
  const visibleOrders = orders.filter((order) => { const localMonth = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit" }).format(new Date(order.paidAt || order.createdAt)).slice(0,7); return (!query || matchesQuery(order, query)) && (!month || localMonth === month); });

  return (
    <main className="admin-dashboard-shell">
      <header className="admin-topbar">
        <div>
          <Link className="admin-brand admin-brand-light" href="/">PADOX <span>PRO</span></Link>
          <p>Admin Packing List</p>
        </div>
        <div className="admin-account">
          <span>{user.email}</span>
          <form action={logoutAdmin}><button type="submit">Log keluar</button></form>
        </div>
      </header>

      <div className="admin-dashboard">
        <AdminNav />
        <section className="admin-heading">
          <div>
            <p className="admin-kicker">ORDER TELAH DIBAYAR</p>
            <h1>Senarai Packing</h1>
            <p>Semua order berstatus Paid dipaparkan di sini, yang terbaru di atas.</p>
          </div>
          <div className="admin-stat">
            <strong>{orders.length}</strong>
            <span>order paid</span>
          </div>
        </section>

        <form className="admin-search" method="get">
          <label htmlFor="order-search">Cari order</label>
          <div>
            <input id="order-search" name="q" defaultValue={q || ""} placeholder="Nama, telefon, order ID atau negeri" />
            <input name="month" type="month" defaultValue={month || ""} />
            <button type="submit">Cari</button>
            {query ? <Link href="/admin/orders">Reset</Link> : null}
          </div>
        </form>

        <section className="admin-orders-card">
          <div className="admin-table-heading">
            <span>{visibleOrders.length} order</span>
            <small>Tekan “Packing list” untuk semak dan cetak</small>
          </div>

          {visibleOrders.length ? (
            <div className="admin-order-list">
              {visibleOrders.map((order) => (
                <article className="admin-order-row" key={order.id}>
                  <div className="admin-order-customer">
                    <strong>{order.customerName}</strong>
                    <span>{order.phone}</span>
                    <small>{order.city}, {order.state}</small>
                  </div>
                  <div className="admin-order-package">
                    <span>{order.packageName}</span>
                    <strong>RM {order.total.toFixed(2)}</strong>
                  </div>
                  <div className="admin-order-meta">
                    <span>{dateFormatter.format(new Date(order.paidAt || order.createdAt))}</span>
                    <small>#{order.id.slice(0, 8).toUpperCase()}</small>
                  </div>
                  <Link className="admin-print-link" href={`/admin/orders/${order.id}/packing-list`}>Packing list</Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <strong>{query ? "Order tidak ditemui" : "Belum ada order Paid"}</strong>
              <p>{query ? "Cuba nama, telefon atau order ID yang lain." : "Order akan muncul di sini selepas callback ToyyibPay berjaya."}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
