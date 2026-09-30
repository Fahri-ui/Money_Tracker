// components/transactions/amount-input.tsx
"use client";

import { useState } from "react";

type AmountInputProps = {
  name: string;
  color?: string;
};

function formatDisplay(digits: string) {
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

export default function AmountInput({ name, color = "#3B82D6" }: AmountInputProps) {
  const [digits, setDigits] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    const cleaned = onlyDigits.replace(/^0+(?=\d)/, "");
    setDigits(cleaned.slice(0, 13));
  }

  const isActive = isFocused || digits.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-2xl border-2 bg-gray-50 px-4 py-4 transition-all duration-200"
        style={{
          borderColor: isActive ? color : "#E5E7EB",
          backgroundColor: isActive ? `${color}08` : undefined,
        }}
      >
        <span
          className="rounded-lg px-2 py-1 text-xl font-bold transition-colors"
          style={{ color: isActive ? color : "#9CA3AF", backgroundColor: isActive ? `${color}15` : "transparent" }}
        >
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formatDisplay(digits)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0"
          className="w-full bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-gray-300"
        />
      </div>

      <input type="hidden" name={name} value={digits} />
    </div>
  );
}