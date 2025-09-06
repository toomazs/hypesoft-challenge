import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopSense - Sistema de Gestão de Produtos",
  description: "Sistema completo de gestão de produtos com autenticação simplificada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}