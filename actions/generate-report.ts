// actions/generate-report.ts
"use server";

import { db } from "@/db";
import { transactions, monthlyReports, users } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

// Fungsi inti: generate laporan bulan LALU untuk SEMUA user
export async function generateMonthlyReportsForAllUsers() {
  const lastMonth = subMonths(new Date(), 1);
  const periodMonth = format(lastMonth, "yyyy-MM");
  const monthStart = format(startOfMonth(lastMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(lastMonth), "yyyy-MM-dd");

  // Ambil semua user yang terdaftar
  const allUsers = await db.select({ id: users.id }).from(users);

  let successCount = 0;

  for (const user of allUsers) {
    // Cek dulu, jangan sampai laporan bulan ini sudah pernah dibuat (hindari duplikat)
    const existing = await db
      .select()
      .from(monthlyReports)
      .where(and(eq(monthlyReports.userId, user.id), eq(monthlyReports.periodMonth, periodMonth)));

    if (existing.length > 0) continue; // skip kalau sudah ada

    // Hitung total income & expense user ini di bulan lalu
    const result = await db
      .select({
        totalIncome: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
        totalExpense: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, user.id),
          gte(transactions.transactionDate, monthStart),
          lte(transactions.transactionDate, monthEnd)
        )
      );

    const totalIncome = Number(result[0].totalIncome);
    const totalExpense = Number(result[0].totalExpense);

    // Skip kalau user ini tidak ada transaksi sama sekali bulan lalu (tidak perlu buat laporan kosong)
    if (totalIncome === 0 && totalExpense === 0) continue;

    await db.insert(monthlyReports).values({
      userId: user.id,
      periodMonth,
      totalIncome: totalIncome.toString(),
      totalExpense: totalExpense.toString(),
      netBalance: (totalIncome - totalExpense).toString(),
    });

    successCount++;
  }

  return { periodMonth, totalUsers: allUsers.length, reportsGenerated: successCount };
}