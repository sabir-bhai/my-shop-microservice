"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import ActionMenu from "./ActionMenu";
import { Product } from "../page";

interface ProductRowProps {
  product: Product;
  onAction: (product: Product, action: "view" | "edit" | "delete") => void;
}

export default function ProductRow({ product, onAction }: ProductRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStockBadgeColor = (stock: number): string => {
    if (stock >= 30) return "bg-green-600";
    if (stock >= 15) return "bg-yellow-600";
    return "bg-orange-600";
  };

  const getStatusBadgeColor = (status: string): string =>
    status === "Published"
      ? "bg-green-600"
      : status === "Draft"
      ? "bg-yellow-600"
      : "bg-gray-600";

  return (
    <div className="flex items-center px-6 py-4 hover:bg-gray-750 transition-colors relative">
      {/* Image */}
      <div className="w-16 flex-shrink-0">
        {product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
            📦
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-medium text-white mb-1 truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{product.slug}</p>
      </div>

      {/* Category */}
      <div className="w-24 flex-shrink-0">
        <span className="text-gray-300 text-sm">{product.category}</span>
      </div>

      {/* Price */}
      <div className="w-24 flex-shrink-0">
        <div className="flex flex-col">
          <span className="font-medium text-white text-sm">
            ${product.salePrice}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ${product.regularPrice}
          </span>
        </div>
      </div>

      {/* Stock */}
      <div className="w-16 flex-shrink-0">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full ${getStockBadgeColor(
            product.stockQuantity
          )}`}
        >
          {product.stockQuantity}
        </span>
      </div>

      {/* Status */}
      <div className="w-24 flex-shrink-0">
        <span
          className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-white rounded-full ${getStatusBadgeColor(
            product.publicationStatus
          )}`}
        >
          {product.publicationStatus}
        </span>
      </div>

      {/* Warranty */}
      <div className="w-28 flex-shrink-0">
        <span className="text-gray-300 text-sm">
          {product.warranty || "N/A"}
        </span>
      </div>

      {/* Actions */}
      <div
        className="w-16 flex-shrink-0 flex justify-center relative"
        ref={menuRef}
      >
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {showMenu && (
          <ActionMenu
            product={product}
            onAction={onAction}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    </div>
  );
}
