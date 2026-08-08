"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { packages } from "@/data/packages";
import { malaysianStates, shippingRates, type MalaysianState } from "@/data/shipping";

type SelectedPackage = (typeof packages)[number];
type Values = { customerName: string; phone: string; email: string; addressLine1: string; addressLine2: string; postcode: string; city: string; state: "" | MalaysianState };
const initial: Values = { customerName: "", phone: "", email: "", addressLine1: "", addressLine2: "", postcode: "", city: "", state: "" };
const money = (value: number) => `RM${value.toFixed(2)}`;

export function CheckoutForm({ selectedPackage }: { selectedPackage: SelectedPackage }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState<{ code: string; discountAmount: number } | null>(null);
  const [checking, setChecking] = useState(false);
  const shipping = values.state ? shippingRates[values.state] : 0;
  const discount = voucher?.discountAmount || 0;
  const total = Math.max(0, selectedPackage.price - discount) + shipping;
  const update = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));

  async function applyVoucher() {
    setError("");
    setChecking(true);
    try {
      const response = await fetch("/api/voucher/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: voucherCode, packageId: selectedPackage.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setVoucher(result);
      setVoucherCode(result.code);
    } catch (voucherError) {
      setVoucher(null);
      setError(voucherError instanceof Error ? voucherError.message : "Voucher tidak sah.");
    } finally {
      setChecking(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const phone = values.phone.replace(/[\s-]/g, "");
    if (!values.customerName || !values.addressLine1 || !values.postcode || !values.city || !values.state) return setError("Sila lengkapkan semua maklumat yang diperlukan.");
    if (!/^(?:0?1\d{8,9}|601\d{8,9})$/.test(phone)) return setError("Masukkan nombor telefon Malaysia yang sah.");
    setBusy(true);
    try {
      const response = await fetch("/api/payment/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageId: selectedPackage.id, customerName: values.customerName, phone: values.phone, email: values.email || undefined, address: [values.addressLine1, values.addressLine2].filter(Boolean).join("\n"), postcode: values.postcode, city: values.city, state: values.state, voucherCode: voucher?.code }) });
      const result = await response.json();
      if (!response.ok || !result.paymentUrl) throw new Error(result.error || "Tidak dapat mencipta bil pembayaran.");
      window.location.assign(result.paymentUrl);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Tidak dapat meneruskan pembayaran.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="checkout-shell">
      <div className="checkout-header"><Link className="checkout-brand" href="/">PADOX <span>PRO</span></Link><p>Checkout selamat</p></div>
      <form className="checkout-grid" onSubmit={submit} noValidate>
        <section className="checkout-card customer-card">
          <p className="checkout-kicker">MAKLUMAT PELANGGAN</p><h1>Lengkapkan pesanan anda</h1>
          <div className="checkout-fields">
            <label>Nama Penuh <b>*</b><input value={values.customerName} onChange={(event) => update("customerName", event.target.value)} required /></label>
            <label>Nombor Telefon <b>*</b><input value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="0123456789" required /></label>
            <label className="field-wide">Email <small>(pilihan)</small><input value={values.email} onChange={(event) => update("email", event.target.value)} type="email" /></label>
            <label className="field-wide">Alamat Baris 1 <b>*</b><input value={values.addressLine1} onChange={(event) => update("addressLine1", event.target.value)} required /></label>
            <label className="field-wide">Alamat Baris 2 <small>(pilihan)</small><input value={values.addressLine2} onChange={(event) => update("addressLine2", event.target.value)} /></label>
            <label>Poskod <b>*</b><input value={values.postcode} onChange={(event) => update("postcode", event.target.value)} required /></label>
            <label>Bandar <b>*</b><input value={values.city} onChange={(event) => update("city", event.target.value)} required /></label>
            <label className="field-wide">Negeri <b>*</b><select value={values.state} onChange={(event) => update("state", event.target.value as Values["state"])} required><option value="">Pilih negeri</option>{malaysianStates.map((state) => <option key={state}>{state}</option>)}</select></label>
          </div>
        </section>
        <aside className="checkout-card summary-card">
          <p className="checkout-kicker">RINGKASAN PESANAN</p>
          <div className="summary-package"><img src={selectedPackage.image} alt="PADOX PRO" /><div><span>Pakej dipilih</span><strong>Package {selectedPackage.quantity}</strong><small>{selectedPackage.quantity} botol</small></div></div>
          <div className="voucher-box">
            <label>Kod voucher <small>(jika ada)</small></label>
            <div><input value={voucherCode} onChange={(event) => { setVoucherCode(event.target.value.toUpperCase()); setVoucher(null); }} aria-label="Kod voucher" /><button type="button" onClick={applyVoucher} disabled={!voucherCode || checking}>{checking ? "Semak..." : "Guna"}</button></div>
          </div>
          <dl><div><dt>Harga produk</dt><dd>{money(selectedPackage.price)}</dd></div>{voucher ? <div className="discount-row"><dt>Voucher ({voucher.code})</dt><dd>-{money(discount)}</dd></div> : null}<div><dt>Penghantaran</dt><dd>{values.state ? money(shipping) : "Pilih negeri"}</dd></div><div className="summary-total"><dt>Final price</dt><dd>{money(total)}</dd></div></dl>
          {error ? <p className="checkout-error">{error}</p> : null}
          <button type="submit" disabled={busy}>{busy ? "Memproses..." : `Bayar ${money(total)}`}</button>
          <p className="checkout-note">Anda akan dibawa ke ToyyibPay untuk melengkapkan pembayaran.</p>
        </aside>
      </form>
    </main>
  );
}
