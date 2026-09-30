// app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getDashboardSummary,
  getMonthlyTrend,
  getRecentMonthlyReports,
  getTodayExpenses,
  getTopSpendingCategory,
} from "@/actions/dashboard";
import TrendChart from "@/components/dashboard/trend-chart";
import TodayExpenses from "@/components/dashboard/today-expenses";
import ReportsTable from "@/components/dashboard/reports-table";
import TopCategoryWidget from "@/components/dashboard/top-category";
import { TrendingUp, TrendingDown } from "lucide-react";

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [summary, trend, reports, todayExpenses, topCategory] = await Promise.all([
    getDashboardSummary(),
    getMonthlyTrend(),
    getRecentMonthlyReports(),
    getTodayExpenses(),
    getTopSpendingCategory(),
  ]);

  return (
    <div className="space-y-5 px-4 pb-6 pt-4 md:px-6 md:pt-6">
      <h1 className="text-base font-semibold text-gray-500">Ringkasan Keuangan</h1>

      {/* Hero: Total Saldo — informasi paling penting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/25">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs font-medium text-white/70">Total Saldo</p>
        <p className="mt-1.5 text-4xl font-bold tracking-tight">{formatRupiah(summary.totalBalance)}</p>
      </div>

      {/* Chip pendukung: Pemasukan & Pengeluaran bulan ini */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-income/10 text-income">
            <TrendingUp size={16} />
          </div>
          <p className="text-[11px] text-gray-400">Pemasukan bulan ini</p>
          <p className="mt-0.5 text-lg font-bold text-income">{formatRupiah(summary.monthlyIncome)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-expense/10 text-expense">
            <TrendingDown size={16} />
          </div>
          <p className="text-[11px] text-gray-400">Pengeluaran bulan ini</p>
          <p className="mt-0.5 text-lg font-bold text-expense">{formatRupiah(summary.monthlyExpense)}</p>
        </div>
      </div>

      {/* Insight ringan, bukan kartu data utama */}
      <TopCategoryWidget data={topCategory} />

      {/* Line Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
        <TrendChart data={trend} />
      </div>

      {/* Rincian Pengeluaran Hari Ini */}
      <TodayExpenses data={todayExpenses} />

      {/* Riwayat Laporan Bulanan */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Riwayat Laporan Bulanan</h2>
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}