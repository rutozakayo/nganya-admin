import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { CurrentYear } from "@/components/current-year";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { PWAInstaller } from "@/components/pwa-installer";
import { ServiceWorkerRegister } from "@/components/sw-register";

export const metadata: Metadata = {
  title: "NGANYA HIRE | Premium Matatu Experience",
  description: "Hire customized Kenyan matatus for events, road trips, and special occasions.",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-full flex flex-col`}
      >
        <ServiceWorkerRegister />
        <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
            {children}
          </Suspense>
        </main>
        <PWAInstaller />
        <footer className="border-t border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <span className="text-2xl font-bold tracking-tighter text-primary">NGANYA<span className="text-secondary">HIRE</span></span>
                <p className="max-w-sm text-sm text-muted-foreground">Internal operations console. Authorised staff and vehicle owners only.</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/admin" className="block hover:text-primary">Admin dashboard</a>
                <a href="/owner" className="block hover:text-primary">Owner portal</a>
              </div>
            </div>
            <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              © <CurrentYear /> NGANYA HIRE. All rights reserved. Made in Nairobi.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
