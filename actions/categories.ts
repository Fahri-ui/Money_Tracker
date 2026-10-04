// actions/categories.ts
"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, isNull, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Ambil kategori GLOBAL (userId NULL) + kategori PERSONAL milik user ini (kalau ada)
export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(categories)
    .where(or(isNull(categories.userId), eq(categories.userId, session.user.id)));
}

// createCategory & deleteCategory tetap sama seperti sebelumnya — tidak berubah,
// karena keduanya memang untuk kategori PERSONAL milik user (fitur custom category masa depan)
export async function createCategory(data: { name: string; type: "income" | "expense"; icon?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(categories).values({
    userId: session.user.id,
    name: data.name,
    type: data.type,
    icon: data.icon,
  });

  revalidatePath("/transactions/new");
}

export async function deleteCategory(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Sengaja HANYA bisa hapus kategori PERSONAL miliknya sendiri.
  // Kategori global (userId NULL) tidak akan pernah cocok kondisi ini, jadi aman dari terhapus user biasa.
  await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, session.user.id)));

  revalidatePath("/transactions/new");
}