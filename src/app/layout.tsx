import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/providers/ToastProvider";
import { MobileGuard } from "@/components/MobileGuard";
import "@/lib/suppress-errors";

export const metadata: Metadata = {
  title: {
    default: "Mr Tecy - On-site Intelligence Assistance",
    template: "%s | Mr Tecy"
  },
  description: "Intelligent on-site assistance to book trusted technicians for vehicle, electrical, and mobile repairs at your doorstep.",
  keywords: ["technician", "repair services", "on-site assistance", "vehicle repair", "electrical repair", "mobile repair", "Mr Tecy"],
  authors: [{ name: "Mr Tecy Team" }],
  creator: "Mr Tecy",
  publisher: "Mr Tecy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mr Tecy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mrtecy.com",
    siteName: "Mr Tecy",
    title: "Mr Tecy - On-site Intelligence Assistance",
    description: "Book trusted technicians for vehicle, electrical, and mobile repairs at your doorstep.",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Mr Tecy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mr Tecy - On-site Intelligence Assistance",
    description: "Book trusted technicians for vehicle, electrical, and mobile repairs at your doorstep.",
    images: ["/logo.svg"],
    creator: "@mrtecy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <ToastProvider>
            <MobileGuard>
              {children}
            </MobileGuard>
          </ToastProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Mr Tecy",
              "url": "https://mrtecy.com",
              "logo": "https://mrtecy.com/logo.svg",
              "description": "Intelligent on-site assistance to book trusted technicians for vehicle, electrical, and mobile repairs at your doorstep.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
