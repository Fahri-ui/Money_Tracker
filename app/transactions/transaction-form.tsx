"use client";

import { useState } from "react";
import { createTransaction } from "@/actions/transactions";
import { useRouter } from "next/navigation";

type Category = {
    id: string;
    name: string;
    type: "income" | "expense";
};

export default function TransactionForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [type, setType] = useState<"income" | "expense">("expense");
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
        router.refresh();
        (document.getElementById("transaction-form") as HTMLFormElement)?.reset();
    }

    return (
    <form id="transaction-form" action={handleSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="flex gap-2">
            <button type="button" onClick={() => setType("expense")} className={`flex-1 rounded-lg py-2 ${type === "expense" ? "bg-red-500 text-white" : "bg-gray-100"}`}>
                Pengeluaran
            </button>
            <button type="button" onClick={() => setType("income")} className={`flex-1 rounded-lg py-2 ${type === "income" ? "bg-green-500 text-white" : "bg-gray-100"}`}>
                Pemasukan
            </button>
        </div>

        <div>
            <label className="mb-1 block text-sm">Kategori</label>
            <select name="categoryId" required className="w-full rounded-lg border p-2">
                <option value="">Pilih kategori</option>
                {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.name}
                </option>
                ))}
            </select>
        </div>

        <div>
            <label className="mb-1 block text-sm">Nominal (Rp)</label>
            <input type="number" name="amount" required min="1" step="1" className="w-full rounded-lg border p-2" placeholder="50000"/>
        </div>

        <div>
            <label className="mb-1 block text-sm">Tanggal</label>
            <input type="date" name="transactionDate" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border p-2"/>
        </div>

        <div>
            <label className="mb-1 block text-sm">Catatan (opsional)</label>
            <input type="text" name="note" className="w-full rounded-lg border p-2" placeholder="Makan siang di warteg"/>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
    </form>
    );
}