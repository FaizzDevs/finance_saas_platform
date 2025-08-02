import { db } from "@/lib/db";
import { transactions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const all = await db
        .select()
        .from(transactions)

    return NextResponse.json(all)
}

export async function POST(req: Request) {
    const body = await req.json();
    const result = await db
        .insert(transactions)
        .values(body)
        .returning()

    return NextResponse.json(result[0])
}