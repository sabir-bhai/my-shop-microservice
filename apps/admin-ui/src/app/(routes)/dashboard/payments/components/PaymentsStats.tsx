// app/components/PaymentsStats.tsx
"use client";

import React from "react";

type StatCardProps = {
  label: string;
  value: string;
  subtext: string;
};

const StatCard = ({ label, value, subtext }: StatCardProps) => (
  <div className=" bg-[#1f2937] p-6 flex flex-col border border-gray-700">
    <p className="text-zinc-300 text-sm">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-sm text-zinc-500">{subtext}</p>
  </div>
);

export default function PaymentsStats() {
  const stats: StatCardProps[] = [
    {
      label: "Total Revenue (7d)",
      value: "$2,789.96",
      subtext: "+12.4% from last week",
    },
    {
      label: "Success Rate",
      value: "96.3%",
      subtext: "3 failures in the last 24h",
    },
    {
      label: "Refunds",
      value: "$49.99",
      subtext: "1 refund in the last 7d",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-6 ">
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}
