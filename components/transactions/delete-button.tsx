"use client";

import { deleteTransaction } from "@/actions/transactions";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
        await deleteTransaction(id);
        router.refresh();
    }

    return (
        <button onClick={handleDelete} className="text-sm text-gray-400 hover:text-red-500">
            Hapus
        </button>
    );
}