import type { Order } from "@/types/order";

export interface PaymentCreationResult {
  paymentUrl: string;
  billCode: string;
}

type ToyyibBillResponse = { BillCode?: unknown };

function getRequiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`ToyyibPay is not configured. Add ${name} to .env.local.`);
  return value;
}

function isBillResponse(value: unknown): value is ToyyibBillResponse[] {
  return Array.isArray(value) && typeof value[0] === "object" && value[0] !== null && "BillCode" in value[0];
}

/** Creates a fixed-amount ToyyibPay bill, then returns its hosted bill URL. */
export async function createPayment(order: Order): Promise<PaymentCreationResult> {
  // Accept the earlier name during migration; new installs should use the
  // explicit USER_SECRET_KEY name in .env.example.
  const userSecretKey = process.env.TOYYIBPAY_USER_SECRET_KEY || process.env.TOYYIBPAY_SECRET_KEY || getRequiredEnvironment("TOYYIBPAY_USER_SECRET_KEY");
  const categoryCode = getRequiredEnvironment("TOYYIBPAY_CATEGORY_CODE");
  const returnUrl = getRequiredEnvironment("TOYYIBPAY_RETURN_URL");
  const callbackUrl = getRequiredEnvironment("TOYYIBPAY_CALLBACK_URL");
  const apiBaseUrl = (process.env.TOYYIBPAY_API_BASE_URL || "https://toyyibpay.com").replace(/\/$/, "");
  const body = new URLSearchParams({
    userSecretKey,
    categoryCode,
    billName: `PADOX PRO Package ${order.packageName.replace("Package ", "")}`.replace(/[^a-zA-Z0-9 _]/g, "").slice(0, 30),
    billDescription: `PADOX PRO order ${order.id}`.replace(/[^a-zA-Z0-9 _]/g, "").slice(0, 100),
    billPriceSetting: "1",
    billPayorInfo: "1",
    billAmount: String(Math.round(order.total * 100)),
    billReturnUrl: returnUrl,
    billCallbackUrl: callbackUrl,
    billExternalReferenceNo: order.id,
    billTo: order.customerName,
    billEmail: order.email || "",
    billPhone: order.phone,
    billPaymentChannel: "0",
  });
  const response = await fetch(`${apiBaseUrl}/index.php/api/createBill`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString(), cache: "no-store" });
  if (!response.ok) throw new Error("ToyyibPay could not create a payment bill. Please try again.");
  const result: unknown = await response.json();
  if (!isBillResponse(result) || typeof result[0].BillCode !== "string" || !result[0].BillCode) throw new Error("ToyyibPay returned an invalid bill response.");
  const billCode = result[0].BillCode;
  return { billCode, paymentUrl: `${apiBaseUrl}/${encodeURIComponent(billCode)}` };
}
