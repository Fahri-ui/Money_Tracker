// actions/settings.ts
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserBudget() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await db
    .select({ monthlyBudget: users.monthlyBudget })
    .from(users)
    .where(eq(users.id, session.user.id));

  return Number(result[0]?.monthlyBudget ?? 0);
}

export async function updateUserBudget(newBudget: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (newBudget < 0) throw new Error("Budget tidak boleh negatif");

  await db
    .update(users)
    .set({ monthlyBudget: newBudget.toString() })
    .where(eq(users.id, session.user.id));

  revalidatePath("/expense");
}