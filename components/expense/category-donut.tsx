// components/expense/category-donut.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type CategoryData = {
  name: string;
  value: number;
  icon: string;
};

// Palet warna untuk tiap potongan donut — variasi dari tema kita
const COLORS = ["#F0956B", "#3B82D6", "#0E8B9E", "#F0BA90", "#8DD3F8", "#2E6FC9"];

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function CategoryDonut({ data }: { data: CategoryData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `Rp ${Number(value || 0).toLocaleString()}`}/>
          </PieChart>
        </ResponsiveContainer>

        {/* Teks total di tengah donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-base font-bold">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Legend manual di bawah chart */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.map((cat, index) => (
          <div key={cat.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-gray-600">
              {cat.icon} {cat.name}
            </span>
            <span className="ml-auto shrink-0 font-medium text-gray-400">
              {((cat.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}