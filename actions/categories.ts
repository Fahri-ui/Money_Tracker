"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq,and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCategories(){
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return db
        .select()
        .from(categories)
        .where(eq(categories.userId, session.user.id))
}

export async function createCategory(data: { name: string; type: "income" | "expense"; icon?: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(categories).values({
        name: data.name,
        type: data.type,
        icon: data.icon,
    });
}

export async function deleteCategory(categoryId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db
        .delete(categories)
        .where(and(eq(categories.id, categoryId), eq(categories.userId, session.user.id)));
}