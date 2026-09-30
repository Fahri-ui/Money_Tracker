// app/transactions/new/page.tsx
import { getCategories } from "@/actions/categories";
import TransactionForm from "@/components/transactions/transaction-form";
import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

export default async function NewTransactionPage() {
  const categoryList = await getCategories();

  return (
    <div className="mx-auto max-w-lg p-4 md:p-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} /> Kembali
      </Link>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ReceiptText size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold">Tambah Transaksi</h1>
          <p className="text-xs text-gray-400">Catat pemasukan atau pengeluaranmu</p>
        </div>
      </div>

      <TransactionForm categories={categoryList} />
    </div>
  );
}