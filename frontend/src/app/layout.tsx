import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopSense Dashboard',
  description: 'Gerenciador de Produtos Hypesoft',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}