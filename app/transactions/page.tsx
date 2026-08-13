import { getTransactions } from "@/actions/transactions";
import { getCategories } from "@/actions/categories";
import TransactionForm from "./transaction-form";
import DeleteButton from "./delete-button";

export default async function TransactionsPage() {
    const [transactionList, categoryList] = await Promise.all([
        getTransactions(),
        getCategories(),
    ]);

  return (
    <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Transaksi</h1>

        <TransactionForm categories={categoryList} />

        <div className="mt-8 space-y-3">
            {transactionList.length === 0 && (
                <p className="text-gray-500">Belum ada transaksi. Tambahkan yang pertama di atas.</p>
            )}
            {transactionList.map((trx) => (
            <div key={trx.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">{trx.note || "(Tanpa catatan)"}</p>
                    <p className="text-sm text-gray-500">{trx.transactionDate}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={trx.type === "income" ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                        {trx.type === "income" ? "+" : "-"} Rp{Number(trx.amount).toLocaleString("id-ID")}
                    </span>
                    <DeleteButton id={trx.id} />
                </div>
            </div>
            ))}
        </div>
    </main>
  );
}