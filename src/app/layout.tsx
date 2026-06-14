import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SENCAILLE FINANCE",
  description: "Gestion des finances de la ferme SENCAILLE",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sencaille",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-primary-text transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <div className="max-w-md mx-auto relative min-h-screen bg-background shadow-lg overflow-x-hidden flex flex-col transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
