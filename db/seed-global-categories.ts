// db/seed-global-categories.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const GLOBAL_CATEGORIES = [
  // Income
  { name: "Uang Saku", type: "income" as const, icon: "💵" },
  { name: "Beasiswa", type: "income" as const, icon: "🎓" },
  { name: "Pemberian", type: "income" as const, icon: "🎁" },
  { name: "Lainnya", type: "income" as const, icon: "📦" },
  // Expense
  { name: "Makan & Minum", type: "expense" as const, icon: "🍜" },
  { name: "Kos / Tempat Tinggal", type: "expense" as const, icon: "🏠" },
  { name: "Transportasi", type: "expense" as const, icon: "🚌" },
  { name: "Pendidikan", type: "expense" as const, icon: "🎓" },
  { name: "Tagihan & Internet", type: "expense" as const, icon: "📱" },
  { name: "Belanja", type: "expense" as const, icon: "🛍️" },
  { name: "Hiburan", type: "expense" as const, icon: "🎮" },
  { name: "Kesehatan", type: "expense" as const, icon: "💊" },
  { name: "Lainnya", type: "expense" as const, icon: "📦" },
];

async function main() {
  const { db } = await import("./index");
  const { categories } = await import("./schema");
  const { and, eq, isNull } = await import("drizzle-orm");

  console.log("🌱 Seeding kategori global...");
  let created = 0;

  for (const cat of GLOBAL_CATEGORIES) {
    const existing = await db
      .select()
      .from(categories)
      .where(and(isNull(categories.userId), eq(categories.name, cat.name), eq(categories.type, cat.type)));

    if (existing.length > 0) {
      console.log(`⏭️  Skip "${cat.name}" (${cat.type}) — sudah ada.`);
      continue;
    }

    await db.insert(categories).values({ ...cat, userId: null });
    console.log(`✅ Dibuat: ${cat.icon} ${cat.name} (${cat.type})`);
    created++;
  }

  console.log(`🎉 Selesai! ${created} kategori global baru dibuat.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Gagal seeding:", err);
  process.exit(1);
});