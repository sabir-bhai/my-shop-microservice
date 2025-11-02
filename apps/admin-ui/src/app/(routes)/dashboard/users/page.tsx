"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import UserTable from "./components/UserTable";
import { UserType } from "./data/mockUsers";
import { Download, FileText } from "lucide-react";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "deleted">("all");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const fetchUsers = async (): Promise<UserType[]> => {
    debugger;
    const res = await axios.get(
      `http://localhost:8080/api/all-users?status=${filter.toLocaleLowerCase()}`
    );
    return res.data.users; // ⬅️ return the array
  };
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<UserType[]>({
    queryKey: ["users", filter],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error fetching users</div>;

  const filteredUsers =
    activeTab === "all"
      ? users.filter((u) => u.status !== "deleted")
      : users.filter((u) => u.status === "deleted");

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // ---------- PDF (server) ----------
  const handleExportPdf = async () => {
    try {
      setIsDownloadingPdf(true);

      // Build query params if needed (status/page/limit). Example uses filter
      const statusParam = filter.toLowerCase(); // adjust if you want activeTab or search
      const resp = await axios.get(
        `http://localhost:8080/api/users-pdf?status=${statusParam}`,
        {
          responseType: "blob",
          // If your server requires auth cookies, include credentials:
          // withCredentials: true,
        }
      );

      // backend should set Content-Disposition header, but we fallback to a filename
      const filename = `users-export-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      downloadBlob(resp.data, filename);
    } catch (err) {
      console.error("PDF download error", err);
      alert("Failed to download PDF");
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  return (
    <div className="p-6 text-white h-screen flex flex-col">
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-6">User Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleExportPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-2 bg-accent text-white px-4 py-1 rounded-lg"
            >
              <FileText size={18} />
              {isDownloadingPdf ? "Preparing PDF..." : "Export PDF"}
            </button>

            <button className="flex items-center gap-2 border border-[#2f2f31] text-white px-4 py-1 rounded-lg">
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all" ? "bg-accent" : "border border-[#2f2f31]"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "deleted" ? "bg-accent" : "border border-[#2f2f31]"
            }`}
          >
            Recycle Bin
          </button>
        </div>

        {/* Search + filter */}
        {/** you can hide filters for deleted tab if needed */}
        <div className="flex items-center justify-between gap-4 mb-6 mt-2">
          <SearchBar value={search} onChange={setSearch} />
          <StatusFilter activeFilter={filter} setActiveFilter={setFilter} />
        </div>
      </div>
      {/* Table */}
      <div className="flex-1">
        <UserTable users={filteredUsers} />
      </div>
    </div>
  );
};

export default Page;
