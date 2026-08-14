// components/transactions/transaction-form.tsx
"use client";

import { useState } from "react";
import { createTransaction } from "@/actions/transactions";
import { useRouter } from "next/navigation";

type Category = {
    id: string;
    name: string;
    type: "income" | "expense";
    icon: string | null;
};

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

    const filteredCategories = categories.filter((c) => c.type === type);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);

        await createTransaction({
            categoryId: formData.get("categoryId") as string,
            type,
            amount: Number(formData.get("amount")),
            note: formData.get("note") as string,
            transactionDate: formData.get("transactionDate") as string,
        });

        setIsSubmitting(false);
        router.push(type === "income" ? "/income" : "/expense");
    }

    return (
        <form action={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                        type === "expense" ? "bg-[#F0956B] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                    >
                    Pengeluaran
                </button>
                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                        type === "income" ? "bg-[#0E8B9E] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                    >
                    Pemasukan
                </button>
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-600">Kategori</label>
                <select name="categoryId" required className="w-full rounded-lg border border-gray-200 p-2.5 text-sm">
                    <option value="">Pilih kategori</option>
                    {filteredCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-600">Nominal (Rp)</label>
                <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    step="1"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                    placeholder="50000"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-600">Tanggal</label>
                <input
                    type="date"
                    name="transactionDate"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm text-gray-600">Catatan (opsional)</label>
                <input
                    type="text"
                    name="note"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                    placeholder="Makan siang di warteg"/>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
        </form>
    );
}