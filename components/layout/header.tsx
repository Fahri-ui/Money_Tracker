// components/layout/header.tsx
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export default async function Header() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Pengguna";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm md:px-6">
      {/* Kiri: Logo (khusus mobile) + Sapaan */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Image src="/icon.png" alt="Money Tracker" width={32} height={32} className="rounded-lg" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Halo, {firstName} 👋</p>
          <p className="text-xs text-gray-400">Kelola keuangan pribadimu dengan mudah</p>
        </div>
      </div>

      {/* Kanan: Tombol Logout */}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </form>
    </header>
  );
}