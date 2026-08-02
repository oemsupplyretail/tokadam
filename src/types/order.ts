import type { MalaysianState } from "@/data/shipping";
import type { PackageId } from "@/data/packages";

export type OrderStatus = "Pending" | "Paid" | "Failed";

export interface Order {
  id: string;
  packageId: PackageId;
  packageName: string;
  productPrice: number;
  shipping: number;
  total: number;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  postcode: string;
  city: string;
  state: MalaysianState;
  createdAt: string;
  status: OrderStatus;
}

export interface CreatePaymentRequest {
  packageId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  shipping: number;
  productPrice: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  packageName: string;
  productPrice: number;
  shipping: number;
  total: number;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  postcode: string;
  city: string;
  state: string;
  createdAt: string;
  paidAt: string | null;
  paymentReference: string | null;
}
