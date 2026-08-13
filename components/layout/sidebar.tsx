import Link from "next/link";
import { Home, TrendingDown, TrendingUp, Info, PlusCircle } from "lucide-react";

const menu = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/expense", label: "Pengeluaran", icon: TrendingDown },
    { href: "/transactions/new", label: "Tambah Transaksi", icon: PlusCircle },
    { href: "/income", label: "Pemasukan", icon: TrendingUp },
    { href: "/about", label: "Tentang Aplikasi", icon: Info },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex md:fixed md:inset-y-0 md:w-64 md:flex-col border-r border-gray-200 bg-white px-4 py-6">
            <div className="mb-8 px-2">
                <span className="text-xl font-bold text-primary">Money Tracker 💰</span>
            </div>
            <nav className="flex flex-col gap-1">
                {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/30">
                    <item.icon size={20} />
                    {item.label}
                </Link>
                ))}
            </nav>
        </aside>
    );
}