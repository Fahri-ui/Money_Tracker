// app/expense/page.tsx
import {
  getTransactionsThisMonth,
  getMonthlyTotalsByType,
  getCategoryBreakdown,
  getDailySpending,
  getExpenseInsight,
} from "@/actions/reports";
import { getUserBudget } from "@/actions/settings";
import MonthlyBarChart from "@/components/dashboard/bar-chart";
import DeleteButton from "@/components/transactions/delete-button";
import BudgetProgress from "@/components/expense/budget-progress";
import CategoryDonut from "@/components/expense/category-donut";
import SpendingHeatmap from "@/components/expense/spending-heatmap";
import InsightCard from "@/components/expense/insight-card";
import { format } from "date-fns";

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default async function ExpensePage() {
  const [
    transactionList,
    monthlyTotals,
    monthlyBudget,
    categoryBreakdown,
    dailySpending,
    insight,
  ] = await Promise.all([
    getTransactionsThisMonth("expense"),
    getMonthlyTotalsByType("expense"),
    getUserBudget(),
    getCategoryBreakdown("expense"),
    getDailySpending(),
    getExpenseInsight(),
  ]);

  const totalThisMonth = transactionList.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex gap-4">
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h1 className="mb-2 text-xl font-bold">Pengeluaran</h1>
          <p className="text-sm text-gray-500">
            Bulan ini: <span className="font-semibold text-[#F0956B]">{formatRupiah(totalThisMonth)}</span>
          </p>
        </div>

        <div className="flex-1">
          <BudgetProgress spent={totalThisMonth} budget={monthlyBudget} />
        </div>
      </div>

      <div className="mb-4">
        <InsightCard dailyAverage={insight.dailyAverage} percentageChange={insight.percentageChange} />
      </div>

      <div className="mb-4">
        {categoryBreakdown.length > 0 ? (
          <CategoryDonut data={categoryBreakdown} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-gray-400">Belum ada data kategori untuk ditampilkan bulan ini.</p>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
        <MonthlyBarChart data={monthlyTotals} color="#F0956B" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Rincian Bulan Ini</h2>
        {transactionList.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada pengeluaran bulan ini.</p>
        ) : (
          <div className="space-y-2">
            {transactionList.map((trx) => (
              <div key={trx.id} className="flex items-center justify-between border-b border-gray-100 py-2.5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{trx.categoryIcon || "📌"}</span>
                  <div>
                    <p className="text-sm font-medium">{trx.categoryName || "Tanpa kategori"}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(trx.transactionDate), "d MMM yyyy")} {trx.note ? `• ${trx.note}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#F0956B]">-{formatRupiah(Number(trx.amount))}</span>
                  <DeleteButton id={trx.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <SpendingHeatmap data={dailySpending} />
      </div>
    </div>
  );
}