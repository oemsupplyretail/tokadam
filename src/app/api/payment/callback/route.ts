import { createHash } from "node:crypto";
import { updateOrderPaymentStatus } from "@/lib/orders";

const statusByToyyibStatus: Record<string, "Pending" | "Paid" | "Failed"> = { "1": "Paid", "2": "Pending", "3": "Failed" };

export async function POST(request: Request) {
  const formData = await request.formData();
  const status = formData.get("status");
  const orderId = formData.get("order_id");
  const reference = formData.get("refno");
  const receivedHash = formData.get("hash");
  const reason = formData.get("reason");
  if (typeof status !== "string" || typeof orderId !== "string" || typeof reference !== "string" || typeof receivedHash !== "string") return new Response("Invalid callback payload.", { status: 400 });
  const secretKey = process.env.TOYYIBPAY_USER_SECRET_KEY || process.env.TOYYIBPAY_SECRET_KEY;
  if (!secretKey) return new Response("Server configuration error.", { status: 500 });
  const expectedHash = createHash("md5").update(`${secretKey}${status}${orderId}${reference}ok`).digest("hex");
  if (expectedHash !== receivedHash) return new Response("Invalid callback signature.", { status: 401 });
  const orderStatus = statusByToyyibStatus[status];
  if (!orderStatus) return new Response("Unknown payment status.", { status: 400 });
  try {
    await updateOrderPaymentStatus(orderId, orderStatus, reference, typeof reason === "string" ? reason : null);
    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Unable to update order.", { status: 500 });
  }
}
