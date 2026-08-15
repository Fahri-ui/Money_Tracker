// components/income/income-timeline.tsx
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Inbox } from "lucide-react";

type IncomeTransaction = {
  id: string;
  amount: string;
  note: string | null;
  transactionDate: string;
  categoryName: string | null;
  categoryIcon: string | null;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function IncomeTimeline({ data }: { data: IncomeTransaction[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Riwayat Pemasukan Bulan Ini</h2>

      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Inbox size={32} className="text-gray-300" />
          <p className="text-sm text-gray-400">Belum ada pemasukan tercatat bulan ini.</p>
        </div>
      ) : (
        <div className="relative space-y-4 pl-2">
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gray-100" />

          {data.map((trx) => (
            <div key={trx.id} className="relative flex items-start gap-3">
              <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0E8B9E]/15 text-base shadow-sm">
                {trx.categoryIcon || "💰"}
              </div>
              <div className="flex flex-1 items-center justify-between pt-1">
                <div>
                  <p className="text-sm font-medium">{trx.categoryName || "Tanpa kategori"}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(trx.transactionDate), "d MMMM yyyy", { locale: idLocale })}
                    {trx.note ? ` • ${trx.note}` : ""}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#0E8B9E]">+{formatRupiah(Number(trx.amount))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}