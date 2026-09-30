// db/migrate-legacy-categories.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Hanya nama yang IDENTIK antara kategori lama (personal) dan kategori global baru
const EXACT_MATCH_NAMES = [
  { name: "Transportasi", type: "expense" as const },
  { name: "Hiburan", type: "expense" as const },
];

async function main() {
  const { db } = await import("./index");
  const { categories, transactions } = await import("./schema");
  const { and, eq, isNull, isNotNull } = await import("drizzle-orm");

  console.log("🔄 Memigrasi kategori personal lama yang duplikat dengan global...");

  for (const target of EXACT_MATCH_NAMES) {
    // Cari kategori GLOBAL yang jadi tujuan migrasi
    const [globalCat] = await db
      .select()
      .from(categories)
      .where(and(isNull(categories.userId), eq(categories.name, target.name), eq(categories.type, target.type)));

    if (!globalCat) {
      console.log(`⚠️  Kategori global "${target.name}" belum ada, lewati (jalankan seed dulu).`);
      continue;
    }

    // Cari semua kategori PERSONAL (userId tidak null) dengan nama sama
    const legacyCats = await db
      .select()
      .from(categories)
      .where(and(isNotNull(categories.userId), eq(categories.name, target.name), eq(categories.type, target.type)));

    for (const legacy of legacyCats) {
      if (legacy.id === globalCat.id) continue;

      // Alihkan semua transaksi yang menunjuk ke kategori personal lama -> ke kategori global
      await db.update(transactions).set({ categoryId: globalCat.id }).where(eq(transactions.categoryId, legacy.id));

      // Hapus kategori personal lama yang sudah tidak dipakai transaksi mana pun
      await db.delete(categories).where(eq(categories.id, legacy.id));

      console.log(`✅ Migrasi "${target.name}" milik user ${legacy.userId} ke kategori global.`);
    }
  }

  console.log("🎉 Migrasi selesai!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migrasi gagal:", err);
  process.exit(1);
});