// components/transactions/transaction-form.tsx
"use client";

import { useState } from "react";
import { createTransaction } from "@/actions/transactions";
import { useRouter } from "next/navigation";
import AmountInput from "./amount-input";
import { ArrowDownCircle, ArrowUpCircle, ChevronDown, Tag, CalendarDays, PenLine, Send } from "lucide-react";

type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string | null;
};

const DATE_ACCENT = "#3B82D6"; // biru primary, netral untuk field Tanggal

export default function TransactionForm({
  categories,
  defaultType = "expense",
}: {
  categories: Category[];
  defaultType?: "income" | "expense";
}) {
  const router = useRouter();
  const [type, setType] = useState<"income" | "expense">(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);
  const accentColor = type === "income" ? "#0E8B9E" : "#F0956B";
  const selectedCategory = filteredCategories.find((c) => c.id === selectedCategoryId);

  function switchType(newType: "income" | "expense") {
    setType(newType);
    setSelectedCategoryId("");
  }

  // Warna border 3 state: normal (samar), focus (pekat), error (merah) — visual saja, tidak ubah aturan validasi
  function fieldBorderStyle(baseColor: string, isFilled: boolean, hasError: boolean) {
    if (hasError) return { borderColor: "#EF4444", backgroundColor: "#FEF2F2" };
    if (isFilled) return { borderColor: baseColor, backgroundColor: `${baseColor}0D` };
    return { borderColor: `${baseColor}40` };
  }

  async function handleSubmit(formData: FormData) {
    const amountValue = Number(formData.get("amount"));
    if (!amountValue || amountValue <= 0) {
      alert("Nominal harus diisi dan lebih dari 0");
      return;
    }

    setIsSubmitting(true);

    await createTransaction({
      categoryId: formData.get("categoryId") as string,
      type,
      amount: amountValue,
      note: formData.get("note") as string,
      transactionDate: formData.get("transactionDate") as string,
    });

    setIsSubmitting(false);
    router.push(type === "income" ? "/income" : "/expense");
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] md:p-6"
    >
      {/* Sliding Toggle Pengeluaran/Pemasukan */}
      <div className="relative flex rounded-2xl bg-gray-100 p-1">
        <div
          className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out"
          style={{ transform: type === "income" ? "translateX(calc(100% + 8px))" : "translateX(0%)" }}
        />
        <button
          type="button"
          onClick={() => switchType("expense")}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
            type === "expense" ? "text-[#F0956B]" : "text-gray-400"
          }`}
        >
          <ArrowDownCircle size={16} />
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => switchType("income")}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
            type === "income" ? "text-[#0E8B9E]" : "text-gray-400"
          }`}
        >
          <ArrowUpCircle size={16} />
          Pemasukan
        </button>
      </div>

      {/* Nominal */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Nominal
        </label>
        <AmountInput name="amount" color={accentColor} />
      </div>

      {/* Kategori & Tanggal — berdampingan di layar ≥640px, vertikal di mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Kategori */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Tag size={12} /> Kategori
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
              {selectedCategory?.icon || "🏷️"}
            </div>
            <select
              name="categoryId"
              required
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setCategoryError(false);
              }}
              onInvalid={() => setCategoryError(true)}
              style={fieldBorderStyle(accentColor, !!selectedCategoryId, categoryError)}
              className="w-full appearance-none rounded-2xl border-2 bg-gray-50 py-3 pl-11 pr-10 text-sm font-medium text-foreground transition-colors focus:outline-none"
            >
              <option value="">Pilih kategori</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ color: "#1A2433" }}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {categoryError && <p className="mt-1 text-xs text-red-500">Kategori wajib dipilih</p>}
        </div>

        {/* Tanggal */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <CalendarDays size={12} /> Tanggal
          </label>
          <input
            type="date"
            name="transactionDate"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={() => setDateError(false)}
            onInvalid={() => setDateError(true)}
            style={fieldBorderStyle(DATE_ACCENT, true, dateError)}
            className="w-full rounded-2xl border-2 bg-gray-50 p-3 text-sm font-medium transition-colors focus:outline-none"
          />
          {dateError && <p className="mt-1 text-xs text-red-500">Tanggal wajib diisi</p>}
        </div>
      </div>

      {/* Catatan */}
      <div>
        <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <PenLine size={12} /> Catatan <span className="normal-case text-gray-300">(opsional)</span>
        </label>
        <input
          type="text"
          name="note"
          className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-sm transition-colors placeholder:text-gray-300 focus:border-primary focus:bg-white focus:outline-none"
          placeholder="Makan siang di warteg"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundColor: accentColor, boxShadow: `0 8px 20px ${accentColor}40` }}
      >
        {isSubmitting ? (
          "Menyimpan..."
        ) : (
          <>
            <Send size={16} />
            Simpan Transaksi
          </>
        )}
      </button>
    </form>
  );
}