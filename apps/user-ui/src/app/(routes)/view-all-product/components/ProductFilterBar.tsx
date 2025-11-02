"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type DropdownItem = {
  title: string;
  options: string[];
};

const filterList: DropdownItem[] = [
  { title: "Categories", options: ["Cleansers", "Toners", "Serums"] },
  { title: "Brands", options: ["Brand A", "Brand B", "Brand C"] },
  { title: "Ingredients", options: ["Vitamin C", "Retinol", "Aloe Vera"] },
  { title: "Size", options: ["Small", "Medium", "Large"] },
  {
    title: "Rating",
    options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
  },
];

export default function FilterBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleCheckbox = (key: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mt-5">
      <h1>All Product</h1>
      <div className="flex items-center justify-between py-2 mt-3 mb-3">
        {/* Left filter buttons */}
        <div className="flex gap-3">
          {filterList.map((filter) => (
            <div key={filter.title} className="relative inline-block">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === filter.title ? null : filter.title)
                }
                className={`flex items-center gap-1 border px-4  py-2 text-sm bg-[#ffffff]
              ${openMenu === filter.title ? "bg-gray-200" : ""}`}
              >
                {filter.title} <ChevronDown size={14} />
              </button>
              {/* Dropdown */}
              {openMenu === filter.title && (
                <div className="absolute z-10 mt-1 w-48 max-h-60 overflow-y-auto bg-white border rounded shadow p-3 space-y-2">
                  {filter.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={!!selected[filter.title + "-" + option]}
                        onChange={() =>
                          toggleCheckbox(filter.title + "-" + option)
                        }
                        className="h-4 w-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* On Sale Button */}
          <button className="border px-3 py-1 text-sm bg-[#ffffff]">
            On Sale
          </button>
        </div>

        {/* Sort */}
        <select className="border px-3 py-3 text-sm  bg-[#ffffff]">
          <option>Relevance</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
