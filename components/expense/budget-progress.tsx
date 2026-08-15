// components/expense/budget-progress.tsx
"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateUserBudget } from "@/actions/settings";
import { useRouter } from "next/navigation";

type BudgetProgressProps = {
  spent: number;
  budget: number;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function BudgetProgress({ spent, budget }: BudgetProgressProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget.toString());
  const [isSaving, setIsSaving] = useState(false);

  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  let barColor = "#0E8B9E";
  let statusText = "Aman terkendali";
  if (percentage >= 90) {
    barColor = "#EF4444";
    statusText = "Hampir mencapai batas!";
  } else if (percentage >= 70) {
    barColor = "#F0956B";
    statusText = "Mulai perhatikan pengeluaran";
  }

  async function handleSave() {
    setIsSaving(true);
    await updateUserBudget(Number(inputValue));
    setIsSaving(false);
    setIsEditing(false);
    router.refresh();
  }

  // Kondisi: user belum pernah set budget sama sekali
  if (budget === 0 && !isEditing) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
        <p className="mb-2 text-sm text-gray-500">Kamu belum mengatur target budget bulanan.</p>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
        >
          Atur Budget Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Budget Bulan Ini</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-gray-300 hover:text-primary">
            <Pencil size={14} />
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="text-gray-300 hover:text-red-500">
            <X size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Masukkan nominal budget"
            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-lg bg-primary py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Budget"}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: barColor }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {formatRupiah(spent)} <span className="text-gray-300">/ {formatRupiah(budget)}</span>
            </span>
            <span className="font-medium" style={{ color: barColor }}>
              {statusText}
            </span>
          </div>
        </>
      )}
    </div>
  );
}