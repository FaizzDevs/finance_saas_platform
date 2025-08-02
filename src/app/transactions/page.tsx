"use client";

import { TransactionForm } from "@/components/forms/transaction-form";
import { TransactionTable } from "@/components/transactions-table";
import { useState } from "react";

export default function TransactionPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <main className="p-4 space-y-8">
            <h1 className="text-xl font-bold">Transaksi</h1>
            <TransactionForm onSuccess={handleRefresh} />
            <TransactionTable refreshKey={refreshKey} />
        </main>
    )
}