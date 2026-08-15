// components/layout/footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 px-4 py-6 text-center md:px-6">
      <p className="text-xs text-gray-400">
        Money Tracker © {year} — Dibuat dengan 💙 oleh{" "}
        <span className="font-medium text-gray-500">Fahri Adburohman Soleh</span>
      </p>
    </footer>
  );
}