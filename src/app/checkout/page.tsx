import { getPackage } from "@/data/packages";
import Link from "next/link";
import { CheckoutForm } from "./CheckoutForm";
import "./checkout.css";

type CheckoutPageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { package: packageId } = await searchParams;
  const selectedPackage = packageId ? getPackage(packageId) : undefined;

  if (!selectedPackage) {
    return <main className="checkout-shell"><div className="checkout-empty"><p className="checkout-kicker">PADOX PRO</p><h1>Pakej tidak ditemui</h1><p>Sila kembali ke halaman utama dan pilih pakej anda.</p><Link href="/#pakej">Pilih pakej</Link></div></main>;
  }

  return <CheckoutForm selectedPackage={selectedPackage} />;
}
