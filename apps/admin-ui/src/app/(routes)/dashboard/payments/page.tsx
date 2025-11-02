"use client";
import React, { useState } from "react";
import PaymentsTopBar from "./components/PaymentsTopBar";
import PaymentsStats from "./components/PaymentsStats";
import RecentTransactions from "./components/RecentTransactions";

function page() {
  const [search, setSearch] = useState("");

  const handleExport = () => {
    console.log("Export CSV clicked");
  };

  return (
    <main className="min-h-screen bg-[#111827] text-white p-4 md:p-8">
      <PaymentsTopBar
        search={search}
        onSearchChange={setSearch}
        onExport={handleExport}
      />
      {/* …rest of page */}
      <PaymentsStats />
      <RecentTransactions />
    </main>
  );
}
export default page;
