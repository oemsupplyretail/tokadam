import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser, isAdminAuthConfigured } from "@/lib/supabase/auth-server";
import { loginAdmin } from "../actions";
import { LoginButton } from "../LoginButton";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  credentials: "Email atau kata laluan tidak betul.",
  config: "Login admin belum dikonfigurasi. Lengkapkan tetapan di Vercel dahulu.",
  service: "Sambungan login terganggu. Sila cuba semula sebentar lagi.",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await getAdminUser()) redirect("/admin/orders");

  const { error } = await searchParams;
  const configured = isAdminAuthConfigured();

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link className="admin-brand" href="/">PADOX <span>PRO</span></Link>
        <p className="admin-kicker">PENGURUSAN PESANAN</p>
        <h1>Packing List</h1>
        <p className="admin-login-copy">Masuk untuk melihat order yang telah dibayar dan mencetak packing list.</p>

        {error && errorMessages[error] ? <p className="admin-alert" role="alert">{errorMessages[error]}</p> : null}
        {!configured ? <p className="admin-setup-note">Tetapkan <code>ADMIN_EMAIL</code> dan <code>SUPABASE_PUBLISHABLE_KEY</code> sebelum menggunakan login ini.</p> : null}

        <form className="admin-login-form" action={loginAdmin}>
          <label htmlFor="admin-email">Email admin</label>
          <input id="admin-email" name="email" type="email" autoComplete="username" required />
          <label htmlFor="admin-password">Kata laluan</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
          <LoginButton />
        </form>
        <Link className="admin-back-link" href="/">← Kembali ke laman utama</Link>
      </section>
    </main>
  );
}
