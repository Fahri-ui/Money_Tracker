// components/expense/spending-heatmap.tsx
"use client";

import { getDaysInMonth, startOfMonth, getDay } from "date-fns";

type DailySpending = {
  date: number; // tanggal (1-31)
  amount: number;
};

function getIntensityColor(amount: number, max: number) {
  if (amount === 0) return "bg-gray-100";
  const ratio = amount / max;
  if (ratio < 0.25) return "bg-[#F0956B]/20";
  if (ratio < 0.5) return "bg-[#F0956B]/40";
  if (ratio < 0.75) return "bg-[#F0956B]/70";
  return "bg-[#F0956B]";
}

export default function SpendingHeatmap({ data }: { data: DailySpending[] }) {
  const now = new Date();
  const totalDays = getDaysInMonth(now);
  const firstDayOfWeek = getDay(startOfMonth(now)); // 0 = Minggu
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  const dayLabels = ["M", "S", "S", "R", "K", "J", "S"];

  // Buat array 1..totalDays, gabung dengan data amount-nya
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const found = data.find((d) => d.date === day);
    return { date: day, amount: found?.amount ?? 0 };
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold">Pola Pengeluaran Bulan Ini</h2>

      <div className="grid grid-cols-7 gap-1.5">
        {dayLabels.map((label, i) => (
          <div key={i} className="text-center text-[10px] text-gray-300">
            {label}
          </div>
        ))}

        {/* Spasi kosong di awal, menyesuaikan hari pertama bulan jatuh di hari apa */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`Tanggal ${cell.date}: Rp${cell.amount.toLocaleString("id-ID")}`}
            className={`aspect-square rounded-md ${getIntensityColor(cell.amount, maxAmount)} flex items-center justify-center text-[9px] text-gray-500`}
          >
            {cell.date}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-gray-400">
        <span>Sedikit</span>
        <span className="h-2.5 w-2.5 rounded-sm bg-gray-100" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#F0956B]/30" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#F0956B]/60" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#F0956B]" />
        <span>Banyak</span>
      </div>
    </div>
  );
}