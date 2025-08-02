import { TransactionForm } from "@/components/forms/transaction-form";

export default function TransactionPage() {
    return (
        <main className="p-4 space-y-8">
            <h1 className="text-xl font-bold">Transaksi</h1>
            <TransactionForm />
        </main>
    )
}