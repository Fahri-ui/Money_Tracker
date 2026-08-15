// app/about/page.tsx
import { auth } from "@/auth";
import Image from "next/image";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldCheck,
  FileDown,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default async function AboutPage() {
  const session = await auth();

  const coreFeatures = [
    {
      icon: Wallet,
      title: "Catat Transaksi",
      desc: "Tambahkan pemasukan atau pengeluaran lewat tombol '+' di navigasi bawah (mobile) atau sidebar (desktop). Setiap transaksi bisa dilengkapi kategori, nominal, tanggal, dan catatan.",
    },
    {
      icon: TrendingDown,
      title: "Pantau Pengeluaran",
      desc: "Lihat rincian pengeluaran bulan berjalan beserta grafik tren 6 bulan terakhir di halaman Pengeluaran.",
    },
    {
      icon: TrendingUp,
      title: "Pantau Pemasukan",
      desc: "Lihat rincian pemasukan bulan berjalan beserta grafik tren 6 bulan terakhir di halaman Pemasukan.",
    },
  ];

  const reportFeatures = [
    {
      icon: Sparkles,
      title: "Rincian Hari Ini",
      desc: "Kartu di halaman Beranda menampilkan seluruh pengeluaranmu hari ini secara real-time — lengkap dengan kategori, catatan, dan jam transaksi.",
    },
    {
      icon: BarChart3,
      title: "Kategori Pengeluaran Terbesar",
      desc: "Sistem otomatis menyoroti kategori dengan pengeluaran tertinggi setiap bulannya, membantumu mengenali pos pengeluaran yang perlu diperhatikan.",
    },
    {
      icon: Calendar,
      title: "Laporan Bulanan Otomatis",
      desc: "Setiap awal bulan, sistem otomatis merangkum seluruh transaksi bulan sebelumnya menjadi satu laporan ringkas di tabel Riwayat Laporan Bulanan.",
    },
    {
      icon: FileDown,
      title: "Ekspor Laporan ke PDF",
      desc: "Unduh laporan bulan mana pun sebagai file PDF lengkap dengan ringkasan saldo dan rincian seluruh transaksi — cukup klik tombol 'PDF' pada tabel laporan.",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary p-2 shadow-md">
          <Image
            src="/icon.png"
            alt="Money Tracker Logo"
            width={64}
            height={64}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold">Money Tracker</h1>
        <p className="mt-1 text-sm text-gray-500">Versi 1.0.0</p>
      </div>

      {/* Deskripsi */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm leading-relaxed text-gray-600">
          Money Tracker adalah aplikasi pencatat keuangan pribadi yang dirancang untuk membantumu
          memantau arus kas harian dengan cepat dan sederhana. Setiap catatan tersimpan aman dan
          hanya bisa diakses oleh akunmu sendiri.
        </p>
      </div>

      {/* Fitur Inti */}
      <div className="mb-6 space-y-3">
        <h2 className="px-1 text-sm font-semibold text-gray-500">Fitur Utama</h2>
        {coreFeatures.map((f) => (
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

      {/* Fitur Laporan & Insight */}
      <div className="mb-6 space-y-3">
        <h2 className="px-1 text-sm font-semibold text-gray-500">Laporan & Insight</h2>
        {reportFeatures.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0E8B9E]/15 text-[#0E8B9E]">
              <f.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{f.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cara Pakai Singkat */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Cara Pakai Singkat</h2>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="font-semibold text-primary">1.</span>
            Tekan tombol <span className="font-medium text-foreground">"+"</span> untuk mencatat transaksi baru — pilih Pemasukan atau Pengeluaran, isi kategori dan nominalnya.
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary">2.</span>
            Buka halaman <span className="font-medium text-foreground">Pengeluaran</span> atau <span className="font-medium text-foreground">Pemasukan</span> untuk melihat rincian dan tren bulanan.
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary">3.</span>
            Cek <span className="font-medium text-foreground">Beranda</span> setiap awal bulan untuk melihat laporan otomatis bulan sebelumnya, dan unduh sebagai PDF jika perlu.
          </li>
        </ol>
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