"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

export function TransactionForm() {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "income",
        category: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    };

    const handleSelectChange = (value: string) => {
        setForm({ ...form, type: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/api/transaction", {
            method: "POST",
            body: JSON.stringify({ ...form, amount: Number(form.amount) }),
            headers: { "Content-Type": "application/json" },
        });

        setForm({ title: "", amount: "", type: "income", category: "" })
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-white rounded-xl shadow-md w-full max-w-md"
        >
            <div className="space-y-1">
                <Label htmlFor="title">Judul</Label>
                <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Judul Transaksi"
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="amount">Jumlah</Label>
                <Input
                    id="amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="100000"
                    type="number"
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="type">Tipe</Label>
                <Select 
                    value={form.type}
                    onValueChange={handleSelectChange}    
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="income">Pemasukan</SelectItem>
                        <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                </Select>
            </div> 

            <div className="space-y-1">
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" name="category" value={form.category} onChange={handleChange} placeholder="Contoh: Gaji, Makan, Transport" />
            </div>   

            <Button type="submit" className="w-full">
                Simpan Transaksi    
            </Button>           
        </form>
    )
}