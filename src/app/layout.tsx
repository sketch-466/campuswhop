import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusWhop - Creator Marketplace for Nigerian Students",
  description: "Buy and sell digital products, join communities, and monetize your skills on CampusWhop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-whop-black text-white antialiased`}>
        <Navbar />
        <main className="pb-20 md:pb-0">{children}</main>
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
