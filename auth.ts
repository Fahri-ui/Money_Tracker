import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, accounts, sessions } from "./db/schema";

// const DEFAULT_CATEGORIES = [
//   // Income
//   { name: "Uang Saku", type: "income" as const, icon: "💵" },
//   { name: "Beasiswa", type: "income" as const, icon: "🎓" },
//   { name: "Pemberian", type: "income" as const, icon: "🎁" },
//   { name: "Lainnya", type: "income" as const, icon: "📦" },
//   // Expense
//   { name: "Makan & Minum", type: "expense" as const, icon: "🍜" },
//   { name: "Kos / Tempat Tinggal", type: "expense" as const, icon: "🏠" },
//   { name: "Transportasi", type: "expense" as const, icon: "🚌" },
//   { name: "Pendidikan", type: "expense" as const, icon: "🎓" },
//   { name: "Tagihan & Internet", type: "expense" as const, icon: "📱" },
//   { name: "Belanja", type: "expense" as const, icon: "🛍️" },
//   { name: "Hiburan", type: "expense" as const, icon: "🎮" },
//   { name: "Kesehatan", type: "expense" as const, icon: "💊" },
//   { name: "Lainnya", type: "expense" as const, icon: "📦" },
// ];

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
    // events: {
    //     async createUser({ user }) {
    //     if (!user.id) return;

    //     await db.insert(categories).values(
    //         DEFAULT_CATEGORIES.map((cat) => ({
    //         userId: user.id as string,
    //         name: cat.name,
    //         type: cat.type,
    //         icon: cat.icon,
    //         }))
    //     );
    //     },
    // },
});