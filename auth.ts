import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, accounts, sessions, categories } from "./db/schema";

const DEFAULT_CATEGORIES = [
    { name: "Gaji", type: "income" as const, icon: "💰" },
    { name: "Bonus", type: "income" as const, icon: "🎁" },
    { name: "Makanan", type: "expense" as const, icon: "🍔" },
    { name: "Transportasi", type: "expense" as const, icon: "🚗" },
    { name: "Hiburan", type: "expense" as const, icon: "🎬" },
    { name: "Tagihan", type: "expense" as const, icon: "🧾" },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
    }),
    providers: [Google],
    session: {
        strategy: "database",
    },
    events: {
        async createUser({ user }) {
        if (!user.id) return;

        await db.insert(categories).values(
            DEFAULT_CATEGORIES.map((cat) => ({
            userId: user.id as string,
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            }))
        );
        },
    },
});