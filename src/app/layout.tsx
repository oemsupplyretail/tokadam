import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
  icons: { icon: theme.favicon },
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
      <body className="min-h-full flex flex-col">{children}<AnalyticsScripts /><AnalyticsEvents /></body>
    </html>
  );
}
