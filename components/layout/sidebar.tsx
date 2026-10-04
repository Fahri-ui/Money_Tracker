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
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:w-64 md:flex-col border-r border-gray-100 bg-white p-3">
      {/* Panel logo — warna solid, kontras dari daftar menu */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-primary-dark px-4 py-4 shadow-sm">
        <Image src="/icon.png" alt="Money Tracker" width={36} height={36} className="rounded-lg" />
        <span className="text-base font-bold tracking-tight text-white">Money Tracker</span>
      </div>

      <nav className="flex flex-col gap-1 px-1">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-150 ${
                isActive ? "bg-primary/10 font-semibold text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <item.icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}