// src/components/layout/Sidebar.tsx
import Link from 'next/link';

// Ícones placeholder. O ideal seria usar uma lib como lucide-react
const HomeIcon = () => <span>🏠</span>;
const PackageIcon = () => <span>📦</span>;
const SettingsIcon = () => <span>⚙️</span>;

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 dark:bg-gray-800/40 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <PackageIcon />
        <span>ShopSense</span>
      </Link>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <HomeIcon />
          Dashboard
        </Link>
        <Link href="/products" className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50">
          <PackageIcon />
          Products
        </Link>
      </nav>
      <div className="mt-auto">
        {/* Futuro link de settings ou logout */}
      </div>
    </aside>
  );
}