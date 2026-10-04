// components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingDown, TrendingUp, Info, Plus } from "lucide-react";

const menu = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/expense", label: "Keluar", icon: TrendingDown },
  { href: "/transactions/new", label: "Tambah", icon: Plus, isFab: true },
  { href: "/income", label: "Masuk", icon: TrendingUp },
  { href: "/about", label: "Info", icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full border border-gray-100 bg-white/95 py-2 shadow-[0_8px_30px_rgba(15,28,46,0.14)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
    >
      {menu.map((item) => {
        if (item.isFab) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="-mt-9 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white transition active:scale-95"
              style={{ background: "linear-gradient(145deg, #2563EB, #1E3A8A)" }}
            >
              <item.icon size={28} />
            </Link>
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ${
              isActive ? "bg-primary/10 text-primary" : "text-gray-400"
            }`}
          >
            <item.icon size={21} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}