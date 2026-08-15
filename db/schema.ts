import {pgTable, uuid, varchar, numeric, date, timestamp, text, primaryKey, integer, pgEnum} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length:255 }).notNull().unique(),
    name: varchar("name", {length:100}),
    image: text("image"),
    emailVerified: timestamp("email_verified"),
    monthlyBudget: numeric("monthly_budget", { precision: 15, scale: 2 }).default("0"), // ✅ tambahan baru
    createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    type: transactionTypeEnum("type").notNull(),
    icon: varchar("icon", { length: 30}), 
});

export const accounts = pgTable("accounts", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (account) => [
    {
        compoundkey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    },
]);

export const sessions = pgTable("sessions", {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    expires: timestamp("expires").notNull(),
})

export const transactions = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
    type: transactionTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    note: text("note"), 
    transactionDate: date("transaction_date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

export const monthlyReports = pgTable("monthly_reports", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    periodMonth: varchar("period_month", { length: 7 }).notNull(),
    totalIncome: numeric("total_income", { precision: 15, scale: 2 }).default("0"),
    totalExpense: numeric("total_expense", { precision: 15, scale: 2 }).default("0"),
    netBalance: numeric("net_balance", { precision: 15, scale: 2 }).default("0"),
    generatedAt: timestamp("generated_at").defaultNow(),
})