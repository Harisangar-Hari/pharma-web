import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PharmaCare — Your Trusted Online Pharmacy",
    template: "%s | PharmaCare",
  },
  description:
    "Order medicines, vitamins, baby care, and health essentials online. Fast delivery, genuine products, expert pharmacist support.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "PharmaCare",
    title: "PharmaCare — Your Trusted Online Pharmacy",
    description:
      "Genuine medicines and health essentials delivered to your door with pharmacist support.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PharmaCare" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PharmaCare — Your Trusted Online Pharmacy",
    description:
      "Genuine medicines and health essentials delivered to your door with pharmacist support.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e7c66",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-[color:var(--color-foreground)]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}