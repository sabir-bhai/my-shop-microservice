"use client";

import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import UserTable from "./components/UserTable";
import PdfPreviewModal from "./components/PdfPreviewModal";
import { UserType } from "./data/mockUsers";
import { Download, FileText } from "lucide-react";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "deleted">("all");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("");
  const fetchUsers = async (): Promise<UserType[]> => {
    debugger;
    const res = await axios.get(
      `http://localhost:8080/users/api/all?status=${filter.toLocaleLowerCase()}`
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
    debugger;
    try {
      setIsDownloadingPdf(true);

      // Build query params with current filter
      const statusParam =
        filter.toLowerCase() === "all" ? "" : filter.toLowerCase();
      const url = statusParam
        ? `http://localhost:8080/users/api/export/pdf?status=${statusParam}&limit=1000`
        : `http://localhost:8080/users/api/export/pdf?limit=1000`;

      console.log("API url", url);
      const resp = await axios.get(url, {
        responseType: "blob",
      });

      // Extract filename from Content-Disposition header or use fallback
      const contentDisposition = resp.headers["content-disposition"];
      let filename = `users-export-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob URL and open modal instead of direct download
      const blobUrl = window.URL.createObjectURL(resp.data);
      setPdfUrl(blobUrl);
      setPdfBlob(resp.data);
      setPdfFilename(filename);
      setIsPdfModalOpen(true);
    } catch (err: any) {
      console.error("PDF download error", err);

      // Show specific error message
      const errorMsg =
        err.response?.data?.message ||
        "Failed to download PDF. Please try again.";
      alert(errorMsg);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    // Clean up blob URL
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setPdfBlob(null);
    setPdfFilename("");
  };

  const handleDownloadPdf = () => {
    if (pdfBlob && pdfFilename) {
      downloadBlob(pdfBlob, pdfFilename);
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

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfUrl}
        onDownload={handleDownloadPdf}
      />
    </div>
  );
};

export default Page;
