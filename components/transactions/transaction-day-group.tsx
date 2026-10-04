// components/transactions/transaction-day-group.tsx
import { formatWIB } from "@/lib/date";
import DeleteButton from "./delete-button"; // ✅ dikembalikan

type Trx = {
  id: string;
  amount: string;
  note: string | null;
  transactionDate: string;
  createdAt: Date | null;
  categoryName: string | null;
  categoryIcon: string | null;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function TransactionDayGroup({
  transactions,
  accentColorClass,
  sign,
}: {
  transactions: Trx[];
  accentColorClass: string;
  sign: "-" | "+";
}) {
  const groups = transactions.reduce<Record<string, Trx[]>>((acc, trx) => {
    (acc[trx.transactionDate] ??= []).push(trx);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([date, items]) => {
        const subtotal = items.reduce((sum, t) => sum + Number(t.amount), 0);
        return (
          <div key={date}>
            <div className="mb-1.5 flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-gray-400">
                {formatWIB(new Date(date + "T00:00:00"), "d MMM yyyy")}
              </span>
              <span className={`text-xs font-semibold ${accentColorClass}`}>{formatRupiah(subtotal)}</span>
            </div>
            <div className="space-y-1">
              {items.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between rounded-xl px-2 py-2.5 transition hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-lg">
                      {trx.categoryIcon || "📌"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{trx.categoryName || "Tanpa kategori"}</p>
                      <p className="text-xs text-gray-400">
                        {trx.createdAt ? formatWIB(trx.createdAt, "HH:mm") : "--:--"}
                        {trx.note ? ` • ${trx.note}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${accentColorClass}`}>
                      {sign}
                      {formatRupiah(Number(trx.amount))}
                    </span>
                    <DeleteButton id={trx.id} /> {/* ✅ dikembalikan */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}