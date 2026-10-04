// components/layout/header.tsx
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export default async function Header() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Pengguna";
  const initials = (session?.user?.name ?? "U").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        {/* <div className="md:hidden">
          <Image src="/logo.png" alt="Money Tracker" width={30} height={30} className="rounded-lg" />
        </div> */}

        <div className="flex items-center gap-2.5">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={38}
              height={38}
              className="rounded-full ring-2 ring-primary/15"
            />
          ) : (
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">Halo, {firstName} 👋</p>
            <p className="text-[11px] text-gray-400">Kelola keuangan pribadimu dengan mudah</p>
          </div>
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </form>
    </header>
  );
}