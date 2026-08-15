// db/seed.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  // Dynamic import — dijalankan SETELAH dotenv.config() di atas selesai
  const { db } = await import("./index");
  const { users, categories, transactions } = await import("./schema");
  const { eq } = await import("drizzle-orm");

  console.log("🌱 Mulai seeding data...");

  const targetEmail = "fahriabdurahmansoleh@gmail.com"; // ⚠️ ganti dengan email Anda
  const existingUser = await db.select().from(users).where(eq(users.email, targetEmail));

  if (existingUser.length === 0) {
    console.error(`❌ User dengan email ${targetEmail} tidak ditemukan. Login dulu lewat aplikasi sebelum seeding.`);
    process.exit(1);
  }

  const userId = existingUser[0].id;
  console.log(`✅ User ditemukan: ${existingUser[0].name} (${userId})`);

  const existingCategories = await db.select().from(categories).where(eq(categories.userId, userId));

  const DEFAULT_CATEGORIES = [
    { name: "Gaji", type: "income" as const, icon: "💰" },
    { name: "Bonus", type: "income" as const, icon: "🎁" },
    { name: "Makanan", type: "expense" as const, icon: "🍔" },
    { name: "Transportasi", type: "expense" as const, icon: "🚗" },
    { name: "Hiburan", type: "expense" as const, icon: "🎬" },
    { name: "Tagihan", type: "expense" as const, icon: "🧾" },
  ];

  let categoryList = existingCategories;
  if (categoryList.length === 0) {
    console.log("📂 Belum ada kategori, membuat kategori default...");
    await db.insert(categories).values(DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })));
    categoryList = await db.select().from(categories).where(eq(categories.userId, userId));
  }

  const incomeCategories = categoryList.filter((c) => c.type === "income");
  const expenseCategories = categoryList.filter((c) => c.type === "expense");

  console.log("💸 Membuat transaksi dummy...");
  const dummyTransactions = [];

  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);

    dummyTransactions.push({
      userId,
      categoryId: incomeCategories[0]?.id,
      type: "income" as const,
      amount: "5000000",
      note: "Gaji bulanan",
      transactionDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-25`,
    });

    for (let i = 0; i < 5; i++) {
      const randomCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const randomDay = Math.floor(Math.random() * 27) + 1;
      const randomAmount = Math.floor(Math.random() * 200000) + 10000;

      dummyTransactions.push({
        userId,
        categoryId: randomCategory?.id,
        type: "expense" as const,
        amount: randomAmount.toString(),
        note: `Transaksi dummy ${i + 1}`,
        transactionDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(randomDay).padStart(2, "0")}`,
      });
    }
  }

  await db.insert(transactions).values(dummyTransactions);
  console.log(`✅ Berhasil membuat ${dummyTransactions.length} transaksi dummy.`);
  console.log("🎉 Seeding selesai!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding gagal:", err);
  process.exit(1);
});