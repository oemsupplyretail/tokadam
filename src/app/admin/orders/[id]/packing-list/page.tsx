import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getPaidOrder } from "@/lib/orders";
import { requireAdminUser } from "@/lib/supabase/auth-server";
import { PrintButton } from "./PrintButton";

type PackingListPageProps = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("ms-MY", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function PackingListPage({ params }: PackingListPageProps) {
  await requireAdminUser();
  const { id } = await params;
  const order = await getPaidOrder(id);
  if (!order) notFound();

  return (
    <main className="packing-page-shell">
      <div className="packing-toolbar no-print">
        <Link href="/admin/orders">← Kembali ke order</Link>
        <PrintButton />
      </div>

      <article className="packing-sheet">
        <header className="packing-header">
          <div>
            <p className="packing-brand">PADOX <span>PRO</span></p>
            <p>PACKING LIST</p>
          </div>
          <div className="packing-order-number">
            <span>ORDER</span>
            <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
          </div>
        </header>

        <section className="packing-summary-grid">
          <div>
            <span>Tarikh bayaran</span>
            <strong>{dateFormatter.format(new Date(order.paidAt || order.createdAt))}</strong>
          </div>
          <div>
            <span>Rujukan bayaran</span>
            <strong>{order.paymentReference || "—"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="packing-paid">PAID</strong>
          </div>
        </section>

        <section className="packing-address">
          <p className="packing-label">HANTAR KEPADA</p>
          <h1>{order.customerName}</h1>
          <a href={`tel:${order.phone}`}>{order.phone}</a>
          <address>{order.address}<br />{order.postcode} {order.city}<br />{order.state}</address>
        </section>

        <section className="packing-items">
          <div className="packing-items-heading">
            <span>ITEM</span>
            <span>KUANTITI</span>
            <span>SEMAK</span>
          </div>
          <div className="packing-item-row">
            <div>
              <strong>{site.productName}</strong>
              <span>{order.packageName}</span>
            </div>
            <strong>{order.packageName.replace(/[^0-9]/g, "") || "1"} botol</strong>
            <span className="packing-checkbox" aria-label="Ruang tanda semakan" />
          </div>
        </section>

        <section className="packing-checks">
          <p className="packing-label">SEMAKAN SEBELUM POS</p>
          <div><span className="packing-checkbox" /> Produk dan kuantiti betul</div>
          <div><span className="packing-checkbox" /> Alamat penerima betul</div>
          <div><span className="packing-checkbox" /> Bungkusan ditutup dengan kemas</div>
        </section>

        <footer className="packing-footer">
          <span>{site.companyName}</span>
          <span>Order ID: {order.id}</span>
          <small>Dokumen ini ialah packing list dan bukan resit pembayaran.</small>
        </footer>
      </article>
    </main>
  );
}
