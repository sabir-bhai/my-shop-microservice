"use client";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: Props) {
  return (
    <div className="min-w-[60%] flex items-center bg-primaryDark  px-3 py-2 rounded-lg text-gray-400">
      <Search size={18} className="mr-2" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-white flex-1"
      />
    </div>
  );
}
export default SearchBar;
