import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings, getOffices } from "@/lib/strapi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamspace Realty",
  description: "Affordable housing development and homeownership solutions in Addis Ababa, Ethiopia.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, offices] = await Promise.all([getSiteSettings(), getOffices()]);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} offices={offices} />
      </body>
    </html>
  );
}
