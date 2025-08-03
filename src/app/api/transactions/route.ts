import { db } from "@/lib/db";
import { transactions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
    const all = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.created_at))

    return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
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