"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "../../shared/componennts/ProductCard/ProductCard";
import { Product } from "../../store/slices/product.slice";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosinstance";
import { Heart, ShoppingBag, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";

const WishlistPage = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistIds(storedWishlist);
  }, []);

  // Listen for wishlist changes
  useEffect(() => {
    const handleWishlistChange = () => {
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setWishlistIds(storedWishlist);
    };

    // Listen for storage changes (if user modifies wishlist in another tab)
    window.addEventListener("storage", handleWishlistChange);

    // Custom event listener for wishlist updates in same tab
    window.addEventListener("wishlistUpdated", handleWishlistChange);

    return () => {
      window.removeEventListener("storage", handleWishlistChange);
      window.removeEventListener("wishlistUpdated", handleWishlistChange);
    };
  }, []);

  // Fetch wishlist products
  const {
    data: wishlistProducts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wishlistProducts", wishlistIds],
    queryFn: async () => {
      if (wishlistIds.length === 0) return [];

      // Fetch products by IDs - adjust this endpoint according to your API
      const response = await axiosInstance.post("/product/api/by-ids", {
        productIds: wishlistIds,
      });
      return response.data.products || response.data;
    },
    enabled: isClient && wishlistIds.length > 0,
  });

  // Clear entire wishlist
  const clearWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify([]));
    setWishlistIds([]);
    toast.success("Wishlist cleared!", {
      icon: "🗑️",
      duration: 2000,
    });
  };

  // Share wishlist (you can implement your own sharing logic)
  const shareWishlist = () => {
    if (navigator.share && wishlistIds.length > 0) {
      navigator.share({
        title: "My Wishlist",
        text: `Check out my wishlist of ${wishlistIds.length} amazing products!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!", {
        icon: "📋",
        duration: 2000,
      });
    }
  };

  // Loading state
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B3E4C]"></div>
      </div>
    );
  }

  // Empty wishlist state
  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-[#6B3E4C]" />
              <h1 className="text-3xl font-bold text-[#191817]">My Wishlist</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Save your favorite items for later
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-[#6B3E4C]/10 to-[#5a2f3c]/10 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-[#6B3E4C]/40" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-sm">0</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-[#191817] mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Start adding products you love to your wishlist. Click the heart
              icon on any product to save it here!
            </p>

            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-[#5a2f3c] to-[#6B3E4C] text-white px-8 py-3 rounded-full font-semibold hover:from-[#4a2532] hover:to-[#5a2f3c] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="relative">
              <Heart className="w-8 h-8 text-[#6B3E4C] fill-current" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {wishlistIds.length}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#191817]">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistIds.length}{" "}
                {wishlistIds.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={shareWishlist}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: wishlistIds.length }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Wishlist
            </h3>
            <p className="text-gray-600 mb-6">
              {error?.message ||
                "Something went wrong while loading your wishlist."}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-[#5a2f3c] to-[#6B3E4C] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#4a2532] hover:to-[#5a2f3c] transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {wishlistProducts && wishlistProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistProducts.map((product: Product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Wishlist Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#191817] mb-2">
                    Wishlist Summary
                  </h3>
                  {wishlistProducts.length} products • Total value: ₹
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => {
                      // Add all wishlist items to cart logic here
                      toast.success("Feature coming soon!", {
                        icon: "🚀",
                        duration: 2000,
                      });
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5a2f3c] to-[#6B3E4C] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#4a2532] hover:to-[#5a2f3c] transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add All to Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
