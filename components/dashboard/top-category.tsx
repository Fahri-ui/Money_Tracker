// components/dashboard/top-category.tsx
type TopCategory = {
  categoryName: string | null;
  categoryIcon: string | null;
  total: string;
} | null;

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function TopCategoryWidget({ data }: { data: TopCategory }) {
  if (!data) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0956B]/15 text-2xl">
        {data.categoryIcon || "📌"}
      </div>
      <div>
        <p className="text-xs text-gray-400">Pengeluaran terbesar bulan ini</p>
        <p className="text-sm font-semibold">
          {data.categoryName} — {formatRupiah(Number(data.total))}
        </p>
      </div>
    </div>
  );
}