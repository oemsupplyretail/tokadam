import { getPackage } from "@/data/packages";
import { validateVoucher } from "@/lib/commerce";
export async function POST(request: Request) {
  try {
    const { code, packageId } = await request.json(); const selected = getPackage(String(packageId || ""));
    if (!selected) return Response.json({ error: "Pakej tidak sah." }, { status: 400 });
    const voucher = await validateVoucher(String(code || ""), selected.id, selected.price);
    return Response.json({ code: voucher?.code, discountAmount: voucher?.discountAmount || 0 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Voucher tidak dapat disemak." }, { status: 400 }); }
}
