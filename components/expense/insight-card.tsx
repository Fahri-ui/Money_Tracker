// components/expense/insight-card.tsx
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

type InsightProps = {
  dailyAverage: number;
  percentageChange: number; // positif = naik, negatif = turun dibanding bulan lalu
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function InsightCard({ dailyAverage, percentageChange }: InsightProps) {
  const isIncrease = percentageChange > 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center gap-1.5 text-gray-400">
          <TrendingUp size={14} />
          <span className="text-xs">Rata-rata Harian</span>
        </div>
        <p className="text-lg font-bold">{formatRupiah(dailyAverage)}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center gap-1.5 text-gray-400">
          {isIncrease ? (
            <ArrowUp size={14} className="text-red-400" />
          ) : (
            <ArrowDown size={14} className="text-[#0E8B9E]" />
          )}
          <span className="text-xs">vs Bulan Lalu</span>
        </div>
        <p className={`text-lg font-bold ${isIncrease ? "text-red-500" : "text-[#0E8B9E]"}`}>
          {isIncrease ? "+" : ""}
          {percentageChange.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}