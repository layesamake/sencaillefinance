import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SENCAILLE Finance",
  description: "Gestion des finances de la ferme SENCAILLE",
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
