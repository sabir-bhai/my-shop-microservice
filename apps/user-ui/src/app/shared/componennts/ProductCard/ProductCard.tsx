"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Product } from "../../../store/slices/product.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { RootState } from "../../../store";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "sonner";
import { Heart, Eye, ShoppingBag, X } from "lucide-react";
import useUser from "../../../hooks/useUser";
import { addToCartLocalStorage } from "../../../store/slices/cartSlice";
export default function ProductCard({
  id,
  images,
  slug,
  tags,
  title,
  description,
  salePrice,
  regularPrice,
  discountPercentage,
}: Product) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistAnimation, setWishlistAnimation] = useState(false);
  const { user } = useUser();

  // Local cart state check
  const isInCart = useAppSelector((state: RootState) =>
    state.cart.items.some((item) => item.id === id)
  );

  // Load wishlist state from localStorage on component mount
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlistItems.includes(id));
  }, [id]);

  // ---- Mutation to add item to cart ----
  const { mutate: addToCartApi, isPending: isAdding } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/cart/api/add-to-cart", {
        productId: id,
        quantity: 1,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data?.message || "Product added to cart successfully", {
        icon: "🛍️",
        duration: 2000,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add product to cart";
      toast.error(errorMessage);
    },
  });

  // ---- Mutation to remove item from cart ----
  const { mutate: removeFromCartApi, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("cart/api/remove-to-cart", {
        data: { productId: id },
      });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(removeFromCart(id));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data?.message || "Product removed from cart successfully", {
        icon: "🗑️",
        duration: 2000,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to remove product from cart";
      toast.error(errorMessage);
    },
  });

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      console.log("User not logged in");
      dispatch(
        addToCartLocalStorage({
          id,
          images,
          slug,
          tags,
          title,
          description,
          salePrice,
          regularPrice,
          warranty: "",
          category: "",
          sku: "",
          stockQuantity: 0,
          discountCode: "",
          publicationStatus: "",
          featuredProduct: false,
          createdAt: "",
          updatedAt: "",
        })
      );
    }
    if (user && !isInCart) {
      if (isInCart) {
        removeFromCartApi();
      } else {
        addToCartApi();
      }
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlistItems.filter((item: string) => item !== id);
      toast.success("Removed from wishlist", {
        icon: "💔",
        duration: 2000,
      });
    } else {
      updatedWishlist = [...wishlistItems, id];
      toast.success("Added to wishlist", {
        icon: "💝",
        duration: 2000,
      });
      // Trigger animation
      setWishlistAnimation(true);
      setTimeout(() => setWishlistAnimation(false), 600);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const isProcessing = isAdding || isRemoving;

  return (
    <div
      className="bg-white border border-gray-100  overflow-hidden shadow-sm transition-all duration-500 group relative transform  backdrop-blur-sm "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-100  translate-x-4"
        }`}
      >
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`relative p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg group/wishlist transform hover:scale-110 ${
            isWishlisted
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white scale-110"
              : "bg-white/95 text-gray-600 hover:bg-red-50 hover:text-red-500"
          } ${wishlistAnimation ? "animate-bounce" : ""}`}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isWishlisted
                ? "fill-current scale-110"
                : "group-hover/wishlist:fill-red-100"
            }`}
          />

          {/* Wishlist pulse effect */}
          {isWishlisted && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
          )}

          {/* Wishlist tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/wishlist:opacity-100 transition-opacity pointer-events-none">
            {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          </div>
        </button>

        {/* Quick View Button */}
        <Link href={`/product/${id}-${slugify(slug)}`}>
          <button className="p-2.5 rounded-full bg-white/95 text-gray-600 backdrop-blur-md hover:bg-[#5a2f3c]/10 hover:text-[#5a2f3c] transition-all duration-300 hover:scale-110 shadow-lg group/view">
            <Eye className="w-4 h-4" />
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/view:opacity-100 transition-opacity pointer-events-none">
              Quick view
            </div>
          </button>
        </Link>
      </div>

      <Link href={`/product/${id}-${slugify(slug)}`}>
        {/* Tags */}
        <div className="flex gap-2 mt-3  relative z-10 ">
          {tags &&
            tags.slice(0, 2).map((tag, index) => (
              <div key={index} className="bg-secondary-10 px-[8px] ">
                <span className="sub-heading-08-regular text-secondary-60 capitalize">
                  {tag}
                </span>
              </div>
            ))}
        </div>

        {/* Image Container */}
        <div className="px-4 py-4">
          <div className="relative w-full h-[220px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={images[0]?.url || "/placeholder-image.jpg"}
              alt={title}
              width={250}
              height={250}
              className={`object-cover w-full h-full transition-all duration-700 ${
                isHovered ? "scale-110 brightness-105" : "scale-100"
              }`}
            />

            {/* Image overlay gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pb-16">
          <h3 className="line-clamp-2 font-inter mb-2 group-hover:text-[#5a2f3c] transition-colors duration-300 leading-snug">
            {title}
          </h3>

          <p className="sub-heading-02-regular   mb-3 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] leading-relaxed opacity-80">
            {description}
          </p>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="paragraph-02-medium">
                  ₹{salePrice?.toLocaleString()}
                </span>
                {regularPrice && regularPrice > salePrice && (
                  <span className="text-sm line-through text-gray-400 font-medium">
                    ₹{regularPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* {discountPercentage > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
                  {discountPercentage}% OFF
                </div>
              )} */}
            </div>

            {/* Savings Display */}
            {regularPrice && regularPrice > salePrice && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-green-600 font-semibold">
                  You save ₹
                  {((regularPrice || 0) - (salePrice || 0)).toLocaleString()}
                </span>
                <span className="text-xs text-green-500">✨</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Enhanced Add/Remove Button */}
      <div className="absolute bottom-[-100%] left-0 right-0 transition-all duration-400 group-hover:bottom-0">
        <button
          onClick={handleCartToggle}
          disabled={isProcessing}
          className={`relative overflow-hidden w-full py-4 font-bold text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
            isInCart
              ? "bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-700 hover:to-red-600 text-white shadow-lg"
              : "bg-[#7f1d1d] text-white shadow-lg"
          } ${
            isProcessing ? "cursor-not-allowed opacity-75" : "hover:shadow-2xl"
          }`}
        >
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs">Processing...</span>
              </div>
            </div>
          )}

          <span
            className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isProcessing ? "opacity-0" : "opacity-100"
            }`}
          >
            {isInCart ? (
              <>
                <X className="w-4 h-4" />
                REMOVE FROM BAG
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </>
            )}
          </span>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
        </button>
      </div>

      {/* Cart Success Indicator */}
      {isInCart && !isProcessing && (
        <div className="absolute top-4 left-4 pointer-events-none z-30">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-full animate-pulse shadow-lg border-2 border-white">
            <ShoppingBag className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Wishlist Success Indicator */}
      {isWishlisted && (
        <div className="absolute top-4 left-4 pointer-events-none z-25">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
            <Heart className="w-3 h-3 fill-current" />
          </div>
        </div>
      )}
    </div>
  );
}
