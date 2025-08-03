"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Transaction = {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    created_at: string;
}

export function TransactionTable({ refreshKey }: { refreshKey: number }) {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true)
    const [editData, setEditData] = useState<Transaction | null>(null);

    useEffect(() => {
        setLoading(true)
        fetch("/api/transactions")
            .then((res) => res.json())
            .then((json) => {
                setData(json)
                setLoading(false)
            })
    }, [refreshKey])


    async function handleDelete(id: string) {
        const confirmDelete = window.confirm("Yakin ingin mengapus transaksi ini?")
        if (!confirmDelete) return;

        const res = await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
        })

        if (res.ok) {
            setData((prev) => prev.filter((trx) => trx.id !== Number(id)));
        } else {
            const errorText = await res.text();
            console.error("Gagal menghapus:", res.status, errorText)
            alert(`Gagal menghapus transaksi.\nStatus: ${res.status}\n${errorText}`);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editData) return;

        const res = await fetch(`/api/transactions/${editData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData)
        });

        if (res.ok) {
            const updated = await res.json();
            setData((prev) => 
                prev.map((trx) => (trx.id === updated.id ? updated : trx))
            );
            setEditData(null);
        } else {
            alert("Gagal memperbarui data.")
        }
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Daftar Transaksi</CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    Tidak ada data transaksi
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((trx) => (
                                <TableRow key={trx.id}>
                                    <TableCell>{trx.title}</TableCell>
                                    <TableCell>
                                        {trx.type === "expense" ? "-" : "+"}Rp {(Number(trx.amount)).toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>
                                        {trx.type === "income" ? "Pemasukan" : "Pengeluaran"}
                                    </TableCell>
                                    <TableCell>{trx.category}</TableCell>
                                    <TableCell>
                                        {trx.created_at
                                        ? format(parseISO(trx.created_at as string), "dd MMMM yyyy HH:mm", { locale: id })
                                        : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditData(trx)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(String(trx.id))}
                                        >
                                            Hapus
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {editData && (
                <Dialog
                    open={Boolean(editData)}
                    onOpenChange={(open) => !open && setEditData(null)}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Edit Transaksi</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="title"
                                        className="text-right"
                                    >
                                        Judul
                                    </Label>
                                    <Input
                                        id="title"
                                        className="col-span-3"
                                        value={editData?.title ?? ""}
                                        onChange={(e) => 
                                            setEditData((prev) => prev && { ...prev, title: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="amount"
                                        className="text-right"
                                    >
                                        Jumlah
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        className="col-span-3"
                                        value={editData? String(editData.amount) : ""}
                                        onChange={(e) => 
                                            setEditData((prev) => prev && { ...prev, amount: Number(e.target.value) })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="category"
                                        className="text-right"
                                    >
                                        Kategori
                                    </Label>
                                    <Input
                                        id="category"
                                        className="col-span-3"
                                        value={editData?.category ?? ""}
                                        onChange={(e) => 
                                            setEditData((prev) => prev && { ...prev, category: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button 
                                    variant="outline"
                                    type="button"
                                    onClick={() => setEditData(null)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit">Simpan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    )
}