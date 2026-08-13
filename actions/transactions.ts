
"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type TransactionInput = {
    categoryId: string;
    type: "income" | "expense";
    amount: number;
    note?: string;
    transactionDate: string; 
};


export async function getTransactions() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.transactionDate));
}


export async function createTransaction(data: TransactionInput) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(transactions).values({
        userId: session.user.id,
        categoryId: data.categoryId,
        type: data.type,
        amount: data.amount.toString(), 
        note: data.note,
        transactionDate: data.transactionDate,
    }); 

    revalidatePath("/transactions");
    revalidatePath("/"); 
}


export async function updateTransaction(id: string, data: TransactionInput) {
const session = await auth();
if (!session?.user?.id) throw new Error("Unauthorized");

    await db
    .update(transactions)
    .set({
        categoryId: data.categoryId,
        type: data.type,
        amount: data.amount.toString(),
        note: data.note,
        transactionDate: data.transactionDate,
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));

    revalidatePath("/transactions");
    revalidatePath("/");
}


export async function deleteTransaction(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));

    revalidatePath("/transactions");
    revalidatePath("/");
}