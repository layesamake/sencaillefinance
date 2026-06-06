import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} bg-gray-950 text-gray-50`} suppressHydrationWarning>
        <div className="max-w-md mx-auto relative min-h-screen bg-gray-950 shadow-lg overflow-x-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
