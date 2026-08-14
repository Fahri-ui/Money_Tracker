// app/page.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardSummary, getMonthlyTrend, getRecentMonthlyReports } from "@/actions/dashboard";
import TrendChart from "@/components/dashboard/trend-chart";
import { LogOut } from "lucide-react";

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [summary, trend, reports] = await Promise.all([
    getDashboardSummary(),
    getMonthlyTrend(),
    getRecentMonthlyReports(),
  ]);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Halo, {session.user?.name?.split(" ")[0]} 👋</p>
          <h1 className="text-xl font-bold">Ringkasan Keuangan</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500">
            <LogOut size={20} />
          </button>
        </form>
      </div>

      {/* Kartu Ringkasan */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-primary p-5 text-white shadow-sm">
          <p className="text-xs opacity-80">Total Saldo</p>
          <p className="mt-1 text-2xl font-bold">{formatRupiah(summary.totalBalance)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Pemasukan Bulan Ini</p>
          <p className="mt-1 text-xl font-bold text-[#0E8B9E]">{formatRupiah(summary.monthlyIncome)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Pengeluaran Bulan Ini</p>
          <p className="mt-1 text-xl font-bold text-[#F0956B]">{formatRupiah(summary.monthlyExpense)}</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
        <TrendChart data={trend} />
      </div>

      {/* Riwayat Laporan Bulanan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Riwayat Laporan Bulanan</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-gray-400">
            Belum ada laporan bulanan. Laporan akan dibuat otomatis setiap awal bulan.
          </p>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => {
              const netBalance = Number(r.totalIncome ?? 0) - Number(r.totalExpense ?? 0);

              return (
                <div key={r.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
                  <span className="text-sm font-medium">{r.periodMonth}</span>
                  <span className="text-sm font-semibold">
                    {formatRupiah(netBalance)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}