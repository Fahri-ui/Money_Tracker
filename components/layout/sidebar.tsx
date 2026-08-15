// components/layout/sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingDown, TrendingUp, Info, PlusCircle } from "lucide-react";

const menu = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/expense", label: "Pengeluaran", icon: TrendingDown },
  { href: "/transactions/new", label: "Tambah Transaksi", icon: PlusCircle },
  { href: "/income", label: "Pemasukan", icon: TrendingUp },
  { href: "/about", label: "Tentang Aplikasi", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:w-64 md:flex-col border-r border-gray-200 bg-white px-4 py-6">
      {/* Logo di atas */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <Image src="/icon.png" alt="Money Tracker" width={36} height={36} className="rounded-lg" />
        <span className="text-lg font-bold text-primary">Money Tracker</span>
      </div>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "-translate-y-0.5 bg-primary text-white shadow-md shadow-primary/40"
                  : "text-foreground hover:bg-secondary/30"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}