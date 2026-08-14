// app/transactions/new/page.tsx
import { getCategories } from "@/actions/categories";
import TransactionForm from "@/components/transactions/transaction-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewTransactionPage() {
    const categoryList = await getCategories();

    return (
        <div className="p-4 md:p-6">
            <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
                <ArrowLeft size={16} /> Kembali
            </Link>
            <h1 className="mb-4 text-xl font-bold">Tambah Transaksi</h1>
            <TransactionForm categories={categoryList} />
        </div>
    );
}