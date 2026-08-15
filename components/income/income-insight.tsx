// components/income/income-insight.tsx
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";

type IncomeInsightProps = {
  averagePerTransaction: number;
  percentageChange: number;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function IncomeInsight({ averagePerTransaction, percentageChange }: IncomeInsightProps) {
  const isIncrease = percentageChange >= 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center gap-1.5 text-gray-400">
          <Wallet size={14} />
          <span className="text-xs">Rata-rata/Transaksi</span>
        </div>
        <p className="text-lg font-bold">{formatRupiah(averagePerTransaction)}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center gap-1.5 text-gray-400">
          {isIncrease ? (
            <ArrowUp size={14} className="text-[#0E8B9E]" />
          ) : (
            <ArrowDown size={14} className="text-red-400" />
          )}
          <span className="text-xs">vs Bulan Lalu</span>
        </div>
        <p className={`text-lg font-bold ${isIncrease ? "text-[#0E8B9E]" : "text-red-500"}`}>
          {isIncrease ? "+" : ""}
          {percentageChange.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}