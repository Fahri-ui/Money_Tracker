    // app/about/page.tsx
import { auth } from "@/auth";
import { Wallet, TrendingUp, TrendingDown, Calendar, ShieldCheck } from "lucide-react";

export default async function AboutPage() {
    const session = await auth();

    const features = [
        {
            icon: Wallet,
            title: "Catat Transaksi",
            desc: "Tambahkan pemasukan atau pengeluaran lewat tombol '+' di navigasi bawah (mobile) atau sidebar (desktop).",
        },
        {
            icon: TrendingDown,
            title: "Pantau Pengeluaran",
            desc: "Lihat rincian dan tren pengeluaran bulananmu di halaman Pengeluaran.",
        },
        {
            icon: TrendingUp,
            title: "Pantau Pemasukan",
            desc: "Lihat rincian dan tren pemasukan bulananmu di halaman Pemasukan.",
        },
        {
            icon: Calendar,
            title: "Laporan Otomatis",
            desc: "Setiap awal bulan, sistem otomatis merangkum laporan keuangan bulan sebelumnya di halaman Beranda.",
        },
    ];

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl">
                    💰
                </div>
                <h1 className="text-xl font-bold">Money Tracker</h1>
                <p className="mt-1 text-sm text-gray-500">Versi 1.0.0</p>
            </div>

            {/* Deskripsi */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-600">
                    Money Tracker adalah aplikasi pencatat keuangan pribadi yang dirancang untuk membantumu
                    memantau arus kas harian dengan cepat dan sederhana. Setiap catatan tersimpan aman.
                </p>
            </div>

            {/* Fitur */}
            <div className="mb-6 space-y-3">
                <h2 className="px-1 text-sm font-semibold text-gray-500">Fitur Utama</h2>
                {features.map((f) => (
                    <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/40 text-primary">
                            <f.icon size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{f.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Akun & Keamanan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck size={18} className="text-primary" />
                    Akun & Keamanan
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p>Masuk sebagai: <span className="font-medium text-foreground">{session?.user?.name}</span></p>
                    <p>Email: <span className="font-medium text-foreground">{session?.user?.email}</span></p>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                    Data transaksimu bersifat pribadi dan tidak dapat dilihat oleh pengguna lain, meskipun
                    menggunakan aplikasi yang sama.
                </p>
            </div>
        </div>
    );
}