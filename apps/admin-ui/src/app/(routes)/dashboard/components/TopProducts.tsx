// components/TopProducts.tsx
import React from "react";
import { TopProduct } from "../types/dashboard";

interface TopProductsProps {
  products: TopProduct[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "electronics":
        return "🎧";
      case "wearables":
        return "⌚";
      case "computers":
        return "💻";
      case "audio":
        return "🔊";
      case "accessories":
        return "📱";
      default:
        return "📦";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-600"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-purple-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white">Top Products</h3>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 text-sm mr-2">
            Best performing products this month
          </span>
          <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
            View All Products Analytics
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-lg">
                <span className="text-lg">
                  {getCategoryIcon(product.category)}
                </span>
              </div>

              <div>
                <h4 className="text-white font-medium">{product.name}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-400">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <div className="flex items-center">
                    <div className="flex text-xs mr-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  ${product.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {product.sales.toLocaleString()} sales
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  className={`w-4 h-4 mr-1 ${
                    product.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      product.change >= 0
                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    }
                  />
                </svg>
                <span
                  className={`text-sm font-medium ${
                    product.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.change >= 0 ? "+" : ""}
                  {product.change}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
