// actions/dashboard.ts
"use server";

import { db } from "@/db";
import { transactions, monthlyReports, categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

// Ringkasan: Total Saldo (all-time), Total Income & Expense bulan ini
export async function getDashboardSummary() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;
    const now = new Date();
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

    // Total saldo dihitung dari SEMUA transaksi (sepanjang waktu)
    const allTimeResult = await db
    .select({
        totalIncome: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
        totalExpense: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));

    // Income & Expense KHUSUS bulan ini
    const thisMonthResult = await db
    .select({
        totalIncome: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
        totalExpense: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
    })
    .from(transactions)
    .where(
        and(
            eq(transactions.userId, userId),
            gte(transactions.transactionDate, monthStart),
            lte(transactions.transactionDate, monthEnd)
        )
    );

    const allTime = allTimeResult[0];
    const thisMonth = thisMonthResult[0];

    return {
        totalBalance: Number(allTime.totalIncome) - Number(allTime.totalExpense),
        monthlyIncome: Number(thisMonth.totalIncome),
        monthlyExpense: Number(thisMonth.totalExpense),
    };
}

// Data tren 6 bulan terakhir, untuk Line Chart
export async function getMonthlyTrend() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;
    const sixMonthsAgo = format(startOfMonth(subMonths(new Date(), 5)), "yyyy-MM-dd");

    const rows = await db
    .select({
        month: sql<string>`to_char(${transactions.transactionDate}, 'YYYY-MM')`,
        totalIncome: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
        totalExpense: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), gte(transactions.transactionDate, sixMonthsAgo)))
    .groupBy(sql`to_char(${transactions.transactionDate}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${transactions.transactionDate}, 'YYYY-MM')`);

    // Isi bulan yang tidak ada transaksinya dengan nilai 0, supaya grafik tetap rapi 6 titik
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const monthKey = format(subMonths(new Date(), i), "yyyy-MM");
        const monthLabel = format(subMonths(new Date(), i), "MMM yyyy");
        const found = rows.find((r) => r.month === monthKey);

        result.push({
            month: monthLabel,
            income: found ? Number(found.totalIncome) : 0,
            expense: found ? Number(found.totalExpense) : 0,
        });
    }

    return result;
}

// Riwayat laporan bulanan (akan terisi otomatis oleh Cron Job di fase mendatang)
export async function getRecentMonthlyReports() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return db
    .select()
    .from(monthlyReports)
    .where(eq(monthlyReports.userId, session.user.id))
    .orderBy(desc(monthlyReports.periodMonth))
    .limit(6);
}

// Rincian pengeluaran KHUSUS hari ini
export async function getTodayExpenses() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const today = format(new Date(), "yyyy-MM-dd");

  return db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      note: transactions.note,
      createdAt: transactions.createdAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.type, "expense"),
        eq(transactions.transactionDate, today)
      )
    )
    .orderBy(desc(transactions.createdAt));
}

export async function getTopSpendingCategory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const rows = await db
    .select({
      categoryName: categories.name,
      categoryIcon: categories.icon,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.type, "expense"),
        gte(transactions.transactionDate, monthStart),
        lte(transactions.transactionDate, monthEnd)
      )
    )
    .groupBy(categories.name, categories.icon)
    .orderBy(desc(sql`SUM(${transactions.amount})`))
    .limit(1);

  return rows[0] ?? null;
}