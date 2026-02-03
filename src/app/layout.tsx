import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/providers/ToastProvider";
import { MobileGuard } from "@/components/MobileGuard";

export const metadata: Metadata = {
  title: "Mr Tecy - Home Service Booking",
  description: "Book home service technicians for car, bike, electrical, and mobile repairs",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mr Tecy",
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
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            <MobileGuard>
              {children}
            </MobileGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
