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
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-xl font-bold">Ringkasan Keuangan</h1>

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

      {/* Widget Kategori Terbesar (Bonus) */}
      <div className="mb-6">
        <TopCategoryWidget data={topCategory} />
      </div>

      {/* Line Chart */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
        <TrendChart data={trend} />
      </div>

      {/* Rincian Pengeluaran Hari Ini */}
      <div className="mb-6">
        <TodayExpenses data={todayExpenses} />
      </div>

      {/* Tabel Riwayat Laporan Bulanan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Riwayat Laporan Bulanan</h2>
        <ReportsTable reports={reports} />
      </div>
    </div>
  );
}