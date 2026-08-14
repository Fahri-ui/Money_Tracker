// app/api/cron/generate-monthly-report/route.ts
export const dynamic = "force-dynamic"; // Tambahkan ini agar route tidak di-cache

import { generateMonthlyReportsForAllUsers } from "@/actions/generate-report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Cek otorisasi
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Jalankan proses
  try {
    const result = await generateMonthlyReportsForAllUsers();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Gagal generate laporan bulanan:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}