// actions/reports.ts
"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

// Ambil transaksi bulan ini, berdasarkan tipe (income/expense), lengkap dengan nama kategori
export async function getTransactionsThisMonth(type: "income" | "expense") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const now = new Date();
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

    return db
    .select({
        id: transactions.id,
        amount: transactions.amount,
        note: transactions.note,
        transactionDate: transactions.transactionDate,
        categoryName: categories.name,
        categoryIcon: categories.icon,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
        and(
            eq(transactions.userId, session.user.id),
            eq(transactions.type, type),
            gte(transactions.transactionDate, monthStart),
            lte(transactions.transactionDate, monthEnd)
        )
    )
    .orderBy(transactions.transactionDate);
}

// Total per bulan (6 bulan terakhir) untuk 1 tipe tertentu — dipakai Bar Chart
export async function getMonthlyTotalsByType(type: "income" | "expense") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const sixMonthsAgo = format(startOfMonth(subMonths(new Date(), 5)), "yyyy-MM-dd");

    const rows = await db
        .select({
            month: sql<string>`to_char(${transactions.transactionDate}, 'YYYY-MM')`,
            total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, session.user.id),
                eq(transactions.type, type),
                gte(transactions.transactionDate, sixMonthsAgo)
            )
        )
        .groupBy(sql`to_char(${transactions.transactionDate}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${transactions.transactionDate}, 'YYYY-MM')`);

    const result = [];
    for (let i = 5; i >= 0; i--) {
        const monthKey = format(subMonths(new Date(), i), "yyyy-MM");
        const monthLabel = format(subMonths(new Date(), i), "MMM yyyy");
        const found = rows.find((r) => r.month === monthKey);

        result.push({
            month: monthLabel,
            total: found ? Number(found.total) : 0,
        });
    }

    return result;
}