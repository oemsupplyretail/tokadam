import Link from "next/link";
import { FiLink, FiUser } from "react-icons/fi";
import { requireAffiliateUser } from "@/lib/supabase/auth-server";
import { getAffiliateSummary } from "@/lib/affiliate-data";
import { logoutAffiliate, updateAffiliateProfile } from "../actions";
import { CopyLink } from "../CopyLink";
import "../affiliate.css";

const rm = (value: number) => `RM ${value.toFixed(2)}`;

export default async function Page({ searchParams }: { searchParams: Promise<{ month?: string; saved?: string }> }) {
  const { affiliate } = await requireAffiliateUser();
  const query = await searchParams;
  const data = await getAffiliateSummary(affiliate.id, query.month);
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const affiliateLink = `${origin}/?ref=${affiliate.code}`;

  return (
    <main className="affiliate-shell">
      <header className="affiliate-topbar">
        <div>
          <Link className="affiliate-brand" href="/">PADOX <span>PRO</span></Link>
          <p>Affiliate Dashboard</p>
        </div>
        <div className="affiliate-account">
          <span>{affiliate.email}</span>
          <form action={logoutAffiliate}><button>Log keluar</button></form>
        </div>
      </header>

      <div className="affiliate-main">
        <section className="affiliate-welcome">
          <p>PRESTASI AFFILIATE</p>
          <h1>Selamat datang, {affiliate.name}</h1>
          <span>Semak jualan, komisen dan maklumat pembayaran anda.</span>
        </section>

        <form className="period-filter">
          <label htmlFor="report-month">Tapis mengikut bulan</label>
          <div>
            <input id="report-month" name="month" type="month" defaultValue={query.month} />
            <button>Tapis</button>
            {query.month ? <Link href="/affiliate/dashboard">Reset</Link> : null}
          </div>
        </form>

        <section className="stats">
          <article><span>Pending commission</span><strong>{rm(data.pending)}</strong><small>Menunggu settlement admin</small></article>
          <article><span>Settlement received</span><strong>{rm(data.settled)}</strong><small>Jumlah bayaran diterima</small></article>
          <article><span>Sales generated</span><strong>{rm(data.sales)}</strong><small>{data.orders.length} order berjaya</small></article>
        </section>

        <section className="affiliate-grid">
          <article className="affiliate-card link-card">
            <div className="card-title"><FiLink /><div><h2>Link affiliate anda</h2><p>Kongsi link ini dengan pelanggan.</p></div></div>
            <CopyLink link={affiliateLink} />
            <div className="affiliate-code"><span>Kod affiliate</span><strong>{affiliate.code}</strong></div>
          </article>

          <article className="affiliate-card profile-card">
            <div className="card-title"><FiUser /><div><h2>Profil pembayaran</h2><p>Pastikan maklumat bank sentiasa tepat.</p></div></div>
            {query.saved ? <p className="success">Profil berjaya dikemas kini.</p> : null}
            <form className="profile" action={updateAffiliateProfile}>
              <label>Nama penuh<input name="name" defaultValue={affiliate.name} required /></label>
              <label>Nombor telefon<input name="phone" defaultValue={affiliate.phone} required /></label>
              <label>Email login<input value={affiliate.email} disabled /></label>
              <label>Nama bank<input name="bankName" defaultValue={affiliate.bank_name} /></label>
              <label className="wide">Nombor akaun<input name="bankAccount" defaultValue={affiliate.bank_account} /></label>
              <button>Simpan perubahan</button>
            </form>
            <p className="password-note">Password dikawal oleh admin dan tidak boleh ditukar di sini.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
