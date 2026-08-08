import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { AdminOrder, Order, OrderStatus } from "@/types/order";

type AdminOrderRow = {
  id: string;
  package_name: string;
  product_price: number;
  shipping: number;
  total: number;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  postcode: string;
  city: string;
  state: string;
  created_at: string;
  paid_at: string | null;
  payment_reference: string | null;
  voucher_code: string | null;
  discount_amount: number;
  affiliate_code: string | null;
  commission_amount: number;
};

const adminOrderColumns = "id,package_name,product_price,shipping,total,customer_name,phone,email,address,postcode,city,state,created_at,paid_at,payment_reference,voucher_code,discount_amount,affiliate_code,commission_amount";

function mapAdminOrder(row: AdminOrderRow): AdminOrder {
  return {
    id: row.id,
    packageName: row.package_name,
    productPrice: Number(row.product_price),
    shipping: Number(row.shipping),
    total: Number(row.total),
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    postcode: row.postcode,
    city: row.city,
    state: row.state,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    paymentReference: row.payment_reference,
    voucherCode: row.voucher_code,
    discountAmount: Number(row.discount_amount),
    affiliateCode: row.affiliate_code,
    commissionAmount: Number(row.commission_amount),
  };
}

export async function saveOrder(order: Order) {
  const { error } = await createSupabaseAdminClient().from("orders").insert({ id: order.id, package_id: order.packageId, package_name: order.packageName, product_price: order.productPrice, subtotal: order.subtotal, voucher_id: order.voucherId || null, voucher_code: order.voucherCode || null, discount_amount: order.discountAmount, affiliate_id: order.affiliateId || null, affiliate_code: order.affiliateCode || null, commission_rate: order.commissionRate, commission_amount: order.commissionAmount, shipping: order.shipping, total: order.total, customer_name: order.customerName, phone: order.phone, email: order.email || null, address: order.address, postcode: order.postcode, city: order.city, state: order.state, status: order.status, created_at: order.createdAt });
  if (error) throw new Error("Unable to save your order.");
}

export async function saveBillCode(orderId: string, billCode: string) {
  const { error } = await createSupabaseAdminClient().from("orders").update({ toyyib_bill_code: billCode, updated_at: new Date().toISOString() }).eq("id", orderId);
  if (error) throw new Error("Unable to save the ToyyibPay bill reference.");
}

export async function updateOrderPaymentStatus(orderId: string, status: OrderStatus, paymentReference: string | null, reason: string | null) {
  const { error } = await createSupabaseAdminClient().from("orders").update({ status, payment_reference: paymentReference, payment_reason: reason, paid_at: status === "Paid" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", orderId);
  if (error) throw new Error("Unable to update payment status.");
}

export async function getPaidOrders(): Promise<AdminOrder[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select(adminOrderColumns)
    .eq("status", "Paid")
    .order("paid_at", { ascending: false, nullsFirst: false })
    .limit(250);

  if (error) throw new Error("Unable to load paid orders.");
  return (data as AdminOrderRow[]).map(mapAdminOrder);
}

export async function getPaidOrder(orderId: string): Promise<AdminOrder | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) return null;

  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select(adminOrderColumns)
    .eq("status", "Paid")
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw new Error("Unable to load the paid order.");
  return data ? mapAdminOrder(data as AdminOrderRow) : null;
}
