import { getPackage } from "@/data/packages";
import { getShippingRate, type MalaysianState } from "@/data/shipping";
import { createPayment } from "@/lib/payments/toyyib";
import { saveBillCode, saveOrder } from "@/lib/orders";
import { enforcePaymentRateLimit } from "@/lib/payment-rate-limit";
import type { CreatePaymentRequest, Order } from "@/types/order";

const malaysianPhonePattern = /^(?:0?1\d{8,9}|601\d{8,9})$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: CreatePaymentRequest): string | undefined {
  if (!isNonEmptyString(payload.customerName) || !isNonEmptyString(payload.phone) || !isNonEmptyString(payload.address) || !isNonEmptyString(payload.postcode) || !isNonEmptyString(payload.city) || !isNonEmptyString(payload.state)) return "Please complete all required delivery details.";
  const normalisedPhone = payload.phone.replace(/[\s-]/g, "");
  if (!malaysianPhonePattern.test(normalisedPhone)) return "Enter a valid Malaysian phone number.";
  if (payload.email !== undefined && (!isNonEmptyString(payload.email) || !/^\S+@\S+\.\S+$/.test(payload.email))) return "Enter a valid email address.";
  return undefined;
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  try {
    await enforcePaymentRateLimit(clientIp);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify payment request limit.";
    return Response.json({ error: message }, { status: message.startsWith("Too many") ? 429 : 503 });
  }
  let payload: CreatePaymentRequest;
  try {
    payload = await request.json() as CreatePaymentRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") return Response.json({ error: "Invalid request body." }, { status: 400 });

  const validationError = validatePayload(payload);
  if (validationError) return Response.json({ error: validationError }, { status: 400 });

  const selectedPackage = getPackage(payload.packageId);
  const shipping = getShippingRate(payload.state);
  if (!selectedPackage || shipping === undefined) return Response.json({ error: "The selected package or state is invalid." }, { status: 400 });

  const order: Order = {
    id: crypto.randomUUID(),
    packageId: selectedPackage.id,
    packageName: `Package ${selectedPackage.quantity}`,
    productPrice: selectedPackage.price,
    shipping,
    total: selectedPackage.price + shipping,
    customerName: payload.customerName.trim(),
    phone: payload.phone.replace(/[\s-]/g, ""),
    email: payload.email?.trim() || undefined,
    address: payload.address.trim(),
    postcode: payload.postcode.trim(),
    city: payload.city.trim(),
    state: payload.state as MalaysianState,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };

  try {
    await saveOrder(order);
    const payment = await createPayment(order);
    await saveBillCode(order.id, payment.billCode);
    return Response.json({ orderId: order.id, paymentUrl: payment.paymentUrl, billCode: payment.billCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create a payment bill.";
    return Response.json({ error: message }, { status: 503 });
  }
}
