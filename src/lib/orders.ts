import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/types/order";

export async function saveOrder(order: Order) {
  const { error } = await createSupabaseAdminClient().from("orders").insert({ id: order.id, package_id: order.packageId, package_name: order.packageName, product_price: order.productPrice, shipping: order.shipping, total: order.total, customer_name: order.customerName, phone: order.phone, email: order.email || null, address: order.address, postcode: order.postcode, city: order.city, state: order.state, status: order.status, created_at: order.createdAt });
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
