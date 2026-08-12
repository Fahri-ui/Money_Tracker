import { signIn } from "@/auth";

export default function LoginPage(){
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Money Tracker 💰</h1>
            <p className="text-gray-500">Silakan login untuk melanjutkan</p>
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" });}}>
            <button type="submit"className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
                Login dengan Google
            </button>
        </form>
    </main>
    );
}