"use client";

import React, { useEffect } from "react";
import { X, CreditCard, Mail, Undo2 } from "lucide-react";

export type PaymentDetail = {
  id: string; // e.g. "pi_1001"
  createdAt: string; // ISO or display string
  amount: number; // 129.99
  currency: string; // "USD"
  status: "Succeeded" | "Processing" | "Failed" | "Refunded";
  methodLabel: string; // e.g. "Visa •••• 4242"
  customerName: string;
  customerEmail: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: PaymentDetail | null;
};

const statusPill: Record<PaymentDetail["status"], string> = {
  Succeeded: "bg-white/10 text-white",
  Processing: "bg-blue-600/20 text-blue-300",
  Failed: "bg-red-600/20 text-red-300",
  Refunded: "bg-amber-600/20 text-amber-300",
};

export default function PaymentDetailsDrawer({ open, onClose, data }: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={open ? "false" : "true"}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-[#0f141c] text-white border-l border-white/10
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold">
              {data ? `Payment #${data.id}` : "Payment"}
            </h2>
            {data && (
              <p className="text-sm text-zinc-400 mt-1">
                Created on {data.createdAt} • ${data.amount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {data && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusPill[data.status]
                }`}
              >
                {data.status}
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close details"
              className="rounded-full p-2 hover:bg-white/5 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto h-[calc(100%-74px)]">
          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <p className="text-zinc-300 text-sm">Method</p>
              <div className="flex items-center gap-2 mt-3 text-zinc-200">
                <CreditCard className="w-4 h-4" />
                <span>{data?.methodLabel}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <p className="text-zinc-300 text-sm">Amount</p>
              <p className="mt-3 text-lg font-semibold">
                ${data?.amount.toFixed(2)}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <p className="text-zinc-300 text-sm">Currency</p>
              <p className="mt-3 text-lg font-semibold">{data?.currency}</p>
            </div>
          </div>

          {/* Customer & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <p className="text-zinc-300 text-sm">Customer</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-white/10 grid place-content-center">
                  <span className="text-sm font-medium">
                    {data
                      ? data.customerName
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                      : "CU"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{data?.customerName}</p>
                  <p className="text-sm text-zinc-400">{data?.customerEmail}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <p className="text-zinc-300 text-sm">Actions</p>
              <div className="flex items-center gap-3 mt-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
                  <Mail className="w-4 h-4" />
                  Send receipt
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
                  <Undo2 className="w-4 h-4" />
                  Issue refund
                </button>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl bg-zinc-900/60 border border-white/10">
            <div className="p-4 border-b border-white/10">
              <p className="font-semibold">Breakdown</p>
            </div>
            <div className="divide-y divide-white/10">
              <Row label="Subtotal" value="$116.99" />
              <Row label="Fees" value="$3.77" />
              <Row
                label="Total"
                value={`$${data?.amount.toFixed(2) ?? "—"}`}
                bold
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-zinc-300">{label}</span>
      <span
        className={`tabular-nums ${
          bold ? "font-semibold text-white" : "text-zinc-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
