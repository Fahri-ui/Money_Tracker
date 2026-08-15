// components/dashboard/today-expenses.tsx
import { format } from "date-fns";
import { CalendarX } from "lucide-react";

type TodayExpense = {
  id: string;
  amount: string;
  note: string | null;
  createdAt: Date | null;
  categoryName: string | null;
  categoryIcon: string | null;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function TodayExpenses({ data }: { data: TodayExpense[] }) {
  const total = data.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Pengeluaran Hari Ini</h2>
        {data.length > 0 && (
          <span className="text-sm font-semibold text-[#F0956B]">{formatRupiah(total)}</span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CalendarX size={32} className="text-gray-300" />
          <p className="text-sm text-gray-400">Belum ada pengeluaran tercatat hari ini.</p>
          <p className="text-xs text-gray-300">Yuk mulai catat transaksimu lewat tombol +</p>
        </div>
      ) : (
        <div className="space-y-1">
          {data.map((trx) => (
            <div key={trx.id} className="flex items-center justify-between rounded-xl px-2 py-2.5 transition hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/40 text-lg">
                  {trx.categoryIcon || "📌"}
                </div>
                <div>
                  <p className="text-sm font-medium">{trx.categoryName || "Tanpa kategori"}</p>
                  <p className="text-xs text-gray-400">
                    {trx.createdAt ? format(new Date(trx.createdAt), "HH:mm") : "--:--"}
                    {trx.note ? ` • ${trx.note}` : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#F0956B]">-{formatRupiah(Number(trx.amount))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}