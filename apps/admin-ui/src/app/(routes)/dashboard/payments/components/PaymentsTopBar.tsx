// app/components/PaymentsTopBar.tsx
"use client";

import React from "react";
import { Download } from "lucide-react";

type PaymentsTopBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  onExport: () => void;
  title?: string;
  subtitle?: string;
  placeholder?: string;
};

export default function PaymentsTopBar({
  search,
  onSearchChange,
  onExport,
  title = "Payments",
  subtitle = "Transactions, refunds, and status overview",
  placeholder = "Search payments...",
}: PaymentsTopBarProps) {
  return (
    <header className="w-full flex flex-col gap-3 md:gap-4">
      {/* Title + subtitle */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-1 text-zinc-400">{subtitle}</p>
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a2332] border border-white/10 text-white px-4 py-3 hover:bg-[#202b3d] transition"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a2332] border border-white/10 text-white px-4 py-3 hover:bg-[#202b3d] transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="md:hidden flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl bg-[#0c1420] border border-white/10 text-zinc-200 placeholder:text-zinc-400 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500/40"
        />
        <button
          onClick={onExport}
          className="rounded-xl bg-[#1a2332] border border-white/10 text-white px-4 py-3 hover:bg-[#202b3d] transition"
        >
          Export
        </button>
      </div>
    </header>
  );
}
