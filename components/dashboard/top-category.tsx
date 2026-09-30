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
    <div className="flex items-center gap-3 rounded-2xl border border-expense/15 bg-expense/5 px-4 py-3">
      <span className="text-xl">{data.categoryIcon || "📌"}</span>
      <p className="text-xs text-gray-600">
        Pengeluaran terbesar bulan ini:{" "}
        <span className="font-semibold text-expense">
          {data.categoryName} — {formatRupiah(Number(data.total))}
        </span>
      </p>
    </div>
  );
}