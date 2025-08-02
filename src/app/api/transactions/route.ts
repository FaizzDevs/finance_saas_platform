import { db } from "@/lib/db";
import { transactions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
    const all = await db
        .select()
        .from(transactions)

    return NextResponse.json(all)
}

export async function POST(req: Request) {
    const body = await req.json();

    if(
        !body.title ||
        typeof body.title !== "string" ||
        !body.category ||
        typeof body.category !== "string" ||
        typeof body.amount !== "number" ||
        body.amount <= 0
    ) {
        return NextResponse.json({ error: "Data tidak valid" }, { status: 400 })
    }

    const result = await db
        .insert(transactions)
        .values(body)
        .returning()

    return NextResponse.json(result[0])
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id)

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

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id)
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