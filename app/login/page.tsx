// app/login/page.tsx
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Money Tracker 💰</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola keuangan pribadimu dengan mudah</p>
        </div>

        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input
                    type="email"
                    disabled
                    placeholder="nama@email.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-400"/>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Password</label>
                <input
                    type="password"
                    disabled
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-400"/>
            </div>
            <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-gray-200 py-2.5 text-sm font-medium text-gray-400">
                Sign In (Segera hadir)
            </button>

            <div className="relative flex items-center py-1">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 text-xs text-gray-400">atau</span>
                <div className="flex-1 border-t border-gray-200" />
            </div>

            <form
                action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/" });
                }}>
                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                    Login dengan Google
                </button>
            </form>
        </div>
    </main>
  );
}