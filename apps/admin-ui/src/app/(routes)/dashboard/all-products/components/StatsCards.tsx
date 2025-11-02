// StatsCards.tsx
import React from "react";
import { Product } from "../page"; // or the correct path

interface StatsCardsProps {
  products: Product[];
}

export default function StatsCards({ products }: StatsCardsProps) {
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "Active").length,
    lowStock: products.filter((p) => p.stockQuantity < 20).length,
    totalValue: products.reduce(
      (sum, p) => sum + p.salePrice * p.stockQuantity,
      0
    ),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-gray-400 text-sm font-medium mb-2">
          Total Products
        </h3>
        <p className="text-3xl font-bold">{stats.totalProducts}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-gray-400 text-sm font-medium mb-2">
          Active Products
        </h3>
        <p className="text-3xl font-bold text-green-400">
          {stats.activeProducts}
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-gray-400 text-sm font-medium mb-2">Low Stock</h3>
        <p className="text-3xl font-bold text-orange-400">{stats.lowStock}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-gray-400 text-sm font-medium mb-2">Total Value</h3>
        <p className="text-3xl font-bold">
          ${stats.totalValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
