// actions/reports.ts
"use server";

import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
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

export async function getTransactionsForMonth(periodMonth: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // periodMonth formatnya "2026-07"
  const [year, month] = periodMonth.split("-");
  const monthStart = `${year}-${month}-01`;
  const monthEnd = format(endOfMonth(new Date(Number(year), Number(month) - 1)), "yyyy-MM-dd");

  return db
    .select({
      transactionDate: transactions.transactionDate,
      type: transactions.type,
      amount: transactions.amount,
      note: transactions.note,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.transactionDate, monthStart),
        lte(transactions.transactionDate, monthEnd)
      )
    )
    .orderBy(transactions.transactionDate);
}

export async function getCategoryBreakdown(type: "income" | "expense") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const rows = await db
    .select({
      name: categories.name,
      icon: categories.icon,
      value: sql<string>`SUM(${transactions.amount})`,
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
    .groupBy(categories.name, categories.icon)
    .orderBy(desc(sql`SUM(${transactions.amount})`));

  return rows.map((r) => ({
    name: r.name ?? "Tanpa kategori",
    icon: r.icon ?? "📌",
    value: Number(r.value),
  }));
}

export async function getDailySpending() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const rows = await db
    .select({
      date: sql<string>`EXTRACT(DAY FROM ${transactions.transactionDate})`,
      amount: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.type, "expense"),
        gte(transactions.transactionDate, monthStart),
        lte(transactions.transactionDate, monthEnd)
      )
    )
    .groupBy(sql`EXTRACT(DAY FROM ${transactions.transactionDate})`);

  return rows.map((r) => ({
    date: Number(r.date),
    amount: Number(r.amount),
  }));
}

export async function getExpenseInsight() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const lastMonthStart = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd");
  const lastMonthEnd = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd");

  // Total pengeluaran bulan ini
  const thisMonthResult = await db
    .select({ total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.type, "expense"),
        gte(transactions.transactionDate, monthStart),
        lte(transactions.transactionDate, monthEnd)
      )
    );

  // Total pengeluaran bulan lalu (untuk perbandingan)
  const lastMonthResult = await db
    .select({ total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.type, "expense"),
        gte(transactions.transactionDate, lastMonthStart),
        lte(transactions.transactionDate, lastMonthEnd)
      )
    );

  const totalThisMonth = Number(thisMonthResult[0].total);
  const totalLastMonth = Number(lastMonthResult[0].total);

  // Rata-rata harian: total dibagi jumlah hari yang SUDAH terlewati bulan ini
  const daysPassed = now.getDate();
  const dailyAverage = daysPassed > 0 ? totalThisMonth / daysPassed : 0;

  // Persentase perubahan dibanding bulan lalu
  let percentageChange = 0;
  if (totalLastMonth > 0) {
    percentageChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
  } else if (totalThisMonth > 0) {
    percentageChange = 100; // bulan lalu 0, bulan ini ada pengeluaran → anggap naik 100%
  }

  return { dailyAverage, percentageChange };
}