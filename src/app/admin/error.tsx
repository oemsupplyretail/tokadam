"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card admin-error-card">
        <p className="admin-kicker">PADOX PRO ADMIN</p>
        <h1>Tidak dapat memuatkan order</h1>
        <p className="admin-login-copy">Sambungan ke pangkalan data terganggu. Rekod order tidak diubah.</p>
        <button className="admin-retry-button" type="button" onClick={reset}>Cuba semula</button>
      </section>
    </main>
  );
}
