import { db } from "@/lib/db";
import { transactions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

function getIdFromRequest(req: NextRequest) {
    const segments = req.nextUrl.pathname.split("/");
    const idString = segments[segments.length - 1];
    const id = Number(idString);

    return id;
}

export async function GET(req: NextRequest) {
    const id = getIdFromRequest(req);

    const data = await db
        .select()
        .from(transactions)
        .where(eq(
            transactions.id, id
        ))

    return NextResponse.json(data[0] ?? null)
}

export async function PUT(req: NextRequest) {
    const id = getIdFromRequest(req);
    const body = await req.json();

    const [updated] = await db
        .update(transactions)
        .set({
            title: body.title,
            amount: body.amount,
            category: body.category,
        })
        .where(eq(
            transactions.id, id
        ))
        .returning()
    
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
    const id = getIdFromRequest(req)

    if (isNaN(id)) {
        return new NextResponse("ID tidak valid", { status: 400 })
    }

    await db
        .delete(transactions)
        .where(eq(
            transactions.id, id
        ))
    
    return NextResponse.json({ message: "Berhasil dihapus" })
}