// app/income/page.tsx
import { getTransactionsThisMonth, getMonthlyTotalsByType, getCategoryBreakdown, getIncomeInsight } from "@/actions/reports";
import MonthlyBarChart from "@/components/dashboard/bar-chart";
import CategoryDonut from "@/components/expense/category-donut";
import IncomeInsight from "@/components/income/income-insight";
import IncomeTimeline from "@/components/income/income-timeline";

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default async function IncomePage() {
  const [transactionList, monthlyTotals, categoryBreakdown, insight] = await Promise.all([
    getTransactionsThisMonth("income"),
    getMonthlyTotalsByType("income"),
    getCategoryBreakdown("income"),
    getIncomeInsight(),
  ]);

  const totalThisMonth = transactionList.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-1 text-xl font-bold">Pemasukan</h1>
      <p className="mb-6 text-sm text-gray-500">
        Bulan ini: <span className="font-semibold text-[#0E8B9E]">{formatRupiah(totalThisMonth)}</span>
      </p>

      <div className="mb-4">
        <IncomeInsight averagePerTransaction={insight.averagePerTransaction} percentageChange={insight.percentageChange} />
      </div>

      <div className="mb-4">
        {categoryBreakdown.length > 0 ? (
          <CategoryDonut data={categoryBreakdown} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-gray-400">Belum ada data sumber pemasukan bulan ini.</p>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
        <MonthlyBarChart data={monthlyTotals} color="#0E8B9E" />
      </div>

      <IncomeTimeline data={transactionList} />
    </div>
  );
}