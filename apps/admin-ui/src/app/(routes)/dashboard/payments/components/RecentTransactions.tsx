// app/components/RecentTransactionsWithDrawer.tsx
"use client";

import React, { useState } from "react";
import PaymentDetailsDrawer, { PaymentDetail } from "./PaymentDetailsDrawer";

type TransactionRow = {
  idShort: string; // "#10021"
  customer: string;
  amount: string;
  status: "Paid" | "Refunded" | "Failed";
  date: string; // "2025-08-01"
  // data to pass to drawer
  detail: PaymentDetail;
};

const rows: TransactionRow[] = [
  {
    idShort: "#10021",
    customer: "Aisha Khan",
    amount: "$129.99",
    status: "Paid",
    date: "2025-08-01",
    detail: {
      id: "pi_1001",
      createdAt: "8/9/2025, 10:06:53 PM",
      amount: 129.99,
      currency: "USD",
      status: "Succeeded",
      methodLabel: "Visa •••• 4242",
      customerName: "Alex Johnson",
      customerEmail: "alex@example.com",
    },
  },
  {
    idShort: "#10020",
    customer: "John Doe",
    amount: "$49.99",
    status: "Paid",
    date: "2025-07-31",
    detail: {
      id: "pi_1002",
      createdAt: "8/8/2025, 02:14:10 PM",
      amount: 49.99,
      currency: "USD",
      status: "Succeeded",
      methodLabel: "PayPal",
      customerName: "John Doe",
      customerEmail: "john@example.com",
    },
  },
  {
    idShort: "#10019",
    customer: "Maria Garcia",
    amount: "$49.99",
    status: "Refunded",
    date: "2025-07-30",
    detail: {
      id: "pi_1003",
      createdAt: "7/30/2025, 11:04:22 AM",
      amount: 49.99,
      currency: "USD",
      status: "Refunded",
      methodLabel: "UPI",
      customerName: "Maria Garcia",
      customerEmail: "maria@example.com",
    },
  },
  {
    idShort: "#10018",
    customer: "Wei Chen",
    amount: "$99.99",
    status: "Failed",
    date: "2025-07-29",
    detail: {
      id: "pi_1004",
      createdAt: "7/29/2025, 04:33:09 PM",
      amount: 99.99,
      currency: "USD",
      status: "Failed",
      methodLabel: "Card •••• 8888",
      customerName: "Wei Chen",
      customerEmail: "wei@example.com",
    },
  },
];

const statusColor: Record<TransactionRow["status"], string> = {
  Paid: "text-emerald-500",
  Refunded: "text-amber-500",
  Failed: "text-red-500",
};

export default function RecentTransactionsWithDrawer() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PaymentDetail | null>(null);

  const onView = (detail: PaymentDetail) => {
    setSelected(detail);
    setOpen(true);
  };

  return (
    <>
      <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-white/5">
                <th className="py-3 px-2 font-medium">ID</th>
                <th className="px-2 font-medium">Customer</th>
                <th className="px-2 font-medium">Amount</th>
                <th className="px-2 font-medium">Status</th>
                <th className="px-2 font-medium">Date</th>
                <th className="px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {rows.map((t) => (
                <tr
                  key={t.idShort}
                  className="border-b border-white/5 hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-3 px-2">{t.idShort}</td>
                  <td className="px-2">{t.customer}</td>
                  <td className="px-2">{t.amount}</td>
                  <td className={`px-2 font-medium ${statusColor[t.status]}`}>
                    {t.status}
                  </td>
                  <td className="px-2">{t.date}</td>
                  <td className="px-2">
                    <button
                      onClick={() => onView(t.detail)}
                      className="px-4 py-1.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <PaymentDetailsDrawer
        open={open}
        onClose={() => setOpen(false)}
        data={selected}
      />
    </>
  );
}
