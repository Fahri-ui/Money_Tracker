// components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingDown, TrendingUp, Info, Plus } from "lucide-react";

const menu = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/expense", label: "Pengeluaran", icon: TrendingDown },
  { href: "/transactions/new", label: "Tambah", icon: Plus, isFab: true },
  { href: "/income", label: "Pemasukan", icon: TrendingUp },
  { href: "/about", label: "Tentang", icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-gray-200 bg-white py-2 md:hidden">
      {menu.map((item) => {
        if (item.isFab) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition active:scale-95"
            >
              <item.icon size={26} />
            </Link>
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              isActive
                ? "-translate-y-1 bg-primary text-white shadow-md shadow-primary/40"
                : "text-gray-400"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}