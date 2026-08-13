// app/page.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Money Tracker 💰</h1>
      <p>Halo, {session.user?.name} 👋</p>
      
      <div className="flex gap-2 flex-col sm:flex-row">
        <Link
          href="/transactions"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Lihat Transaksi
        </Link>
        
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}