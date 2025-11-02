import React, { useState } from "react";
import { Search, Plus, Edit2 } from "lucide-react";
import { CreateBannerModal } from "./CreateBannerModal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Toggle } from "./ui/Toggle";
import { Banner } from "../types/banner";
import { mockBanners } from "../data/banner";

export const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeBanners = banners.filter((b) => b.status === "active").length;
  const inactiveBanners = banners.filter((b) => b.status === "inactive").length;

  const toggleBannerStatus = (id: string) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status:
                banner.status === "active" ? "inactive" : ("active" as const),
            }
          : banner
      )
    );
  };

  const handleCreateBanner = (
    newBanner: Omit<Banner, "id" | "created" | "updated">
  ) => {
    const banner: Banner = {
      ...newBanner,
      id: (banners.length + 1).toString(),
      created: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      updated: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setBanners([...banners, banner]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Banners Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create Banner
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search banners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={20} />}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-6 mb-8 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Active: {activeBanners}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Inactive: {inactiveBanners}</span>
        </div>
        <span className="text-gray-300">Total: {banners.length}</span>
      </div>

      {/* Banners Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Banner
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Title
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Link
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Created
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Updated
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner, index) => (
                <tr
                  key={banner.id}
                  className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                >
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-6 border-2 border-gray-400 rounded"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">{banner.title}</td>
                  <td className="py-4 px-6">
                    {banner.link ? (
                      <a
                        href={banner.link}
                        className="text-purple-400 hover:text-purple-300 truncate max-w-xs block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {banner.link}
                      </a>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          banner.status === "active"
                            ? "bg-green-800 text-green-200"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {banner.status}
                      </span>
                      <Toggle
                        checked={banner.status === "active"}
                        onChange={() => toggleBannerStatus(banner.id)}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    {banner.created}
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    {banner.updated}
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBanners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No banners found</p>
            {searchTerm && (
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search terms
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create Banner Modal */}
      <CreateBannerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateBanner}
      />
    </div>
  );
};
