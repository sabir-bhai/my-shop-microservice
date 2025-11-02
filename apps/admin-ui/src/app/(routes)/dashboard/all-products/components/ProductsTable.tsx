import React from "react";
import ProductRow from "./ProductRow";
import { Product } from "../page";

interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  onAction: (product: Product, action: "view" | "edit" | "delete") => void;
}

export default function ProductsTable({
  products,
  searchTerm,
  onAction,
}: ProductsTableProps) {
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
        <div className="w-16">Image</div>
        <div className="flex-1 min-w-0 pr-4">Product</div>
        <div className="w-24">Category</div>
        <div className="w-20">Price</div>
        <div className="w-16">Stock</div>
        <div className="w-20">Status</div>
        <div className="w-20">Warranty</div>
        <div className="w-16">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-700">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onAction={onAction}
            />
          ))
        ) : (
          <div className="px-6 py-4 text-gray-400 text-sm">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
