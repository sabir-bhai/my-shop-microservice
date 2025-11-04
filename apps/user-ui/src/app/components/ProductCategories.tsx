"use client";

import React, { useState } from "react";
import ProductCard from "../shared/componennts/ProductCard/ProductCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/hook";

const ProductCategories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = ["All", "Baby Soaps", "Shampoos", "Baby Oils", "Powders"];
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.cart.isOpen);
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:8080/product/api"
      );
      console.log("Product data", data);
      return data; // must return an array of products
    },
  });
  return (
    <div className="w-full bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Must Haves Title */}
          <h1 className="text-3xl font-light text-gray-800 tracking-wide">
            All Categories
          </h1>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-200
                  ${
                    activeTab === tab
                      ? "bg-red-900 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
          {products.length > 0
            ? products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))
            : !isLoading && (
                <p className="text-center text-gray-600 col-span-full">
                  No products available.
                </p>
              )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
