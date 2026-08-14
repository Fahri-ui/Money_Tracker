// app/income/page.tsx
import { getTransactionsThisMonth, getMonthlyTotalsByType } from "@/actions/reports";
import MonthlyBarChart from "@/components/dashboard/bar-chart";
import DeleteButton from "@/components/transactions/delete-button";
import { format } from "date-fns";

function formatRupiah(amount: number) {
     return `Rp${amount.toLocaleString("id-ID")}`;
}

export default async function IncomePage() {
    const [transactionList, monthlyTotals] = await Promise.all([
        getTransactionsThisMonth("income"),
        getMonthlyTotalsByType("income"),
    ]);

    const totalThisMonth = transactionList.reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <div className="p-4 md:p-6">
            <h1 className="mb-1 text-xl font-bold">Pemasukan</h1>
            <p className="mb-6 text-sm text-gray-500">
                Bulan ini: <span className="font-semibold text-[#0E8B9E]">{formatRupiah(totalThisMonth)}</span>
            </p>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-2 text-sm font-semibold">Tren 6 Bulan Terakhir</h2>
                <MonthlyBarChart data={monthlyTotals} color="#0E8B9E" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold">Rincian Bulan Ini</h2>
                {transactionList.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada pemasukan bulan ini.</p>
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
                                <span className="text-sm font-semibold text-[#0E8B9E]">+{formatRupiah(Number(trx.amount))}</span>
                                <DeleteButton id={trx.id} />
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}