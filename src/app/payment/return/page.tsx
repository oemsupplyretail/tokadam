import Link from "next/link";
import { PurchaseEvent } from "@/components/AnalyticsEvents";

type PaymentReturnPageProps = {
  searchParams: Promise<{ status_id?: string; billcode?: string; order_id?: string }>;
};

const paymentStates: Record<string, { title: string; message: string }> = {
  "1": { title: "Pembayaran berjaya", message: "Terima kasih. Pembayaran anda telah diterima." },
  "2": { title: "Pembayaran sedang diproses", message: "Sila tunggu seketika sementara status pembayaran dikemas kini." },
  "3": { title: "Pembayaran tidak berjaya", message: "Tiada bayaran diterima. Anda boleh kembali dan cuba semula." },
};

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const { status_id: statusId, order_id: orderId } = await searchParams;
  const paymentState = paymentStates[statusId || ""] || { title: "Status pembayaran", message: "Sila semak semula status pembayaran anda." };

  return <main className="checkout-shell">{statusId === "1" ? <PurchaseEvent /> : null}<section className="checkout-empty"><p className="checkout-kicker">PADOX PRO</p><h1>{paymentState.title}</h1><p>{paymentState.message}</p>{orderId ? <p>Rujukan pesanan: <strong>{orderId}</strong></p> : null}<Link href="/">Kembali ke halaman utama</Link></section></main>;
}
