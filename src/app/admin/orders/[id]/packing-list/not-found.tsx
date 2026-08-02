import Link from "next/link";

export default function PackingListNotFound() {
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card admin-error-card">
        <p className="admin-kicker">PADOX PRO ADMIN</p>
        <h1>Packing list tidak ditemui</h1>
        <p className="admin-login-copy">Order ini tiada, belum dibayar, atau tidak lagi tersedia.</p>
        <Link className="admin-retry-button" href="/admin/orders">Kembali ke senarai order</Link>
      </section>
    </main>
  );
}
