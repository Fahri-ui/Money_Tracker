// components/dashboard/reports-table.tsx
"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { getTransactionsForMonth } from "@/actions/reports";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format as formatDate } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Report = {
  id: string;
  periodMonth: string;
  totalIncome: string | null;
  totalExpense: string | null;
  netBalance: string | null;
};

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function monthLabel(periodMonth: string) {
  const [year, month] = periodMonth.split("-");
  return formatDate(new Date(Number(year), Number(month) - 1), "MMMM yyyy", { locale: idLocale });
}

async function loadImageAsBase64(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ReportsTable({ reports }: { reports: Report[] }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(report: Report) {
    setDownloadingId(report.id);

    try {
      const transactionList = await getTransactionsForMonth(report.periodMonth);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // === WATERMARK LOGO (digambar duluan, jadi lapisan paling belakang) ===
      try {
        const logoBase64 = await loadImageAsBase64("/icon.png");

        doc.saveGraphicsState();
        // @ts-expect-error - GState belum punya tipe resmi di jsPDF
        doc.setGState(new doc.GState({ opacity: 0.08 }));

        const watermarkSize = 120; // ukuran watermark dalam mm
        const centerX = (pageWidth - watermarkSize) / 2;
        const centerY = (pageHeight - watermarkSize) / 2;

        doc.addImage(logoBase64, "PNG", centerX, centerY, watermarkSize, watermarkSize);
        doc.restoreGraphicsState();
      } catch (imgError) {
        console.warn("Watermark logo gagal dimuat, PDF tetap dibuat tanpa watermark:", imgError);
      }

      // === KOP / JUDUL LAPORAN (kode yang sudah ada sebelumnya) ===
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Laporan Keuangan Bulanan", 14, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(monthLabel(report.periodMonth), 14, 25);

      // Ringkasan
      doc.setFontSize(10);
      doc.text(`Total Pemasukan: ${formatRupiah(Number(report.totalIncome))}`, 14, 34);
      doc.text(`Total Pengeluaran: ${formatRupiah(Number(report.totalExpense))}`, 14, 40);
      doc.setFont("helvetica", "bold");
      doc.text(`Saldo Bersih: ${formatRupiah(Number(report.netBalance))}`, 14, 46);

      // Tabel rincian transaksi
      autoTable(doc, {
        startY: 54,
        head: [["Tanggal", "Tipe", "Kategori", "Nominal", "Catatan"]],
        body: transactionList.map((t) => [
          formatDate(new Date(t.transactionDate), "d MMM yyyy", { locale: idLocale }),
          t.type === "income" ? "Pemasukan" : "Pengeluaran",
          t.categoryName || "-",
          formatRupiah(Number(t.amount)),
          t.note || "-",
        ]),
        headStyles: { fillColor: [59, 130, 214] },
        styles: { fontSize: 9 },
        columnStyles: { 3: { halign: "right" } },
      });

      // === FOOTER: credit kecil di bawah halaman (bonus) ===
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Dibuat otomatis oleh Money Tracker", 14, pageHeight - 10);

      doc.save(`Laporan-${report.periodMonth}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Gagal membuat laporan PDF. Coba lagi.");
    } finally {
      setDownloadingId(null);
    }
  }

  if (reports.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Belum ada laporan bulanan. Laporan akan dibuat otomatis setiap awal bulan.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
            <th className="py-2 pr-2 font-medium">No</th>
            <th className="py-2 pr-2 font-medium">Bulan</th>
            <th className="py-2 pr-2 font-medium text-right">Pemasukan</th>
            <th className="py-2 pr-2 font-medium text-right">Pengeluaran</th>
            <th className="py-2 pr-2 font-medium text-right">Sisa Saldo</th>
            <th className="py-2 pl-2 font-medium text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, index) => (
            <tr key={r.id} className="border-b border-gray-100 last:border-0">
              <td className="py-3 pr-2 text-gray-400">{index + 1}</td>
              <td className="py-3 pr-2 font-medium capitalize">{monthLabel(r.periodMonth)}</td>
              <td className="py-3 pr-2 text-right text-[#0E8B9E]">{formatRupiah(Number(r.totalIncome))}</td>
              <td className="py-3 pr-2 text-right text-[#F0956B]">{formatRupiah(Number(r.totalExpense))}</td>
              <td className="py-3 pr-2 text-right font-semibold">{formatRupiah(Number(r.netBalance))}</td>
              <td className="py-3 pl-2 text-center">
                <button
                  onClick={() => handleDownload(r)}
                  disabled={downloadingId === r.id}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-50"
                >
                  {downloadingId === r.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <FileDown size={14} />
                  )}
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}