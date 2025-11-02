"use client";
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Dummy search data
const searchSuggestions = [
  "iPhone 15 Pro Max",
  "Samsung Galaxy S24",
  "MacBook Air M3",
  "iPad Pro 12.9",
  "AirPods Pro 2nd Gen",
  "Sony WH-1000XM5",
  "Nike Air Force 1",
  "Adidas Ultraboost 22",
  "PlayStation 5",
  "Xbox Series X",
  "Dell XPS 13",
  "Canon EOS R6",
  "Apple Watch Series 9",
  "Tesla Model 3 Accessories",
  "Gaming Chair RGB",
  "Mechanical Keyboard",
  "Wireless Mouse",
  "4K Monitor",
  "Bluetooth Speaker",
  "Fitness Tracker",
  "Smartphone Case",
  "Laptop Bag",
  "Power Bank 20000mAh",
  "USB-C Cable",
  "Wireless Charger",
];

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
  className = "flex-1 mx-8",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Show max 8 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearch(searchQuery);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    handleSearch(suggestion);
  };

  const handleSearch = (query: string) => {
    // Call the onSearch prop if provided
    if (onSearch) {
      onSearch(query);
    } else {
      // Default search behavior
      console.log("Searching for:", query);
      // For example: router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim().length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => (
      <span
        key={index}
        className={
          part.toLowerCase() === highlight.toLowerCase()
            ? "font-semibold text-yellow-400"
            : ""
        }
      >
        {part}
      </span>
    ));
  };

  return (
    <div className={className} ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 rounded-full bg-white text-[#191817] border border-gray-300 shadow-sm focus:outline-none focus:border-[#7c1e1f] focus:ring-1 focus:ring-[#636262] transition-all duration-200"
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-purple-600 transition-colors"
          onClick={() => handleSearch(searchQuery)}
        />

        {/* Search Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`px-4 py-3 cursor-pointer flex items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                  index === selectedIndex
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700"
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <Search className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {highlightText(suggestion, searchQuery)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
