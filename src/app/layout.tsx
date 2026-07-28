import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/config/site";
import { theme } from "@/config/theme";
import { AnalyticsEvents } from "@/components/AnalyticsEvents";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.metadata.title,
  description: site.metadata.description,
  icons: { icon: theme.favicon },
  openGraph: {
    title: site.metadata.title,
    description: site.metadata.description,
    images: [{ url: "/images/og.png", width: 5000, height: 2625, alt: "PADOX PRO — 45 MINIT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.metadata.title,
    description: site.metadata.description,
    images: ["/images/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsScripts />
        <AnalyticsEvents />
        <Analytics />
      </body>
    </html>
  );
}
