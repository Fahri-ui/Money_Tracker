// app/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import Sidebar from "@/components/layout/sidebar";
import BottomNav from "@/components/layout/bottom-nav";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Aplikasi pencatat keuangan pribadi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="id">
      <body>
        {session ? (
          <div className="min-h-screen">
            <Sidebar />
            <div className="md:ml-64">
              <Header />
              <main className="pb-24 md:pb-6">
                {children}
                <Footer />
              </main>
            </div>
            <BottomNav />
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}