"use client";

import React from "react";

import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onStatusFilter,
  placeholder = "Search coupons...",
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <select
        onChange={(e) => onStatusFilter(e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="scheduled">Scheduled</option>
        <option value="draft">Draft</option>
        <option value="expired">Expired</option>
      </select>
    </div>
  );
};

export default SearchBar;
