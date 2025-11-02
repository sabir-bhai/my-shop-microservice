import React from "react";
import { Search, Filter } from "lucide-react";

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
          />
        </div>
        <button className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>
    </div>
  );
}
