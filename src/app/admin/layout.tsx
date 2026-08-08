import type { Metadata } from "next";
import "./admin.css";
import "./management.css";

export const metadata: Metadata = {
  title: "Admin Packing List | PADOX PRO",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
