"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import CustomerReviews from "./components/CustomerReviews";
import { ReviewData, ReviewStats } from "./types/review";
import axiosInstance from "../../../utils/axiosinstance";

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  regularPrice: number;
  salePrice: number;
  warranty?: string;
  category?: string;
  sku?: string;
  stockQuantity?: number;
  discountCode?: string;
  tags: string[];
  publicationStatus: string;
  featuredProduct: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

// API function to fetch product
const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await axios.get<Product>(
    `http://localhost:8080/product/api/products/${id}`
  );
  return data;
};

// API function to fetch reviews stats (for product rating display)
const fetchReviews = async (productId: string) => {
  const res = await axios.get(
    `http://localhost:8080/product/api/products/${productId}/reviews`,
    {
      params: { page: 1, limit: 10 }, // pagination
    }
  );
  return res.data.data;
};

const Page = () => {
  const { slug } = useParams<{ slug: string }>();
  const id = slug?.split("-")[0];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("120 ML");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");

  // Fetch product by ID
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
    error: productErrorMessage,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  // Fetch review stats for product rating display
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (isError) return <p>Failed to load reviews.</p>;

  const sizes = ["120 ML", "250 ML", "500 ML", "1000 ML"];

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Calculate discount percentage
  const discountPercentage = product
    ? Math.round(
        ((product.regularPrice - product.salePrice) / product.regularPrice) *
          100
      )
    : 0;

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Product
          </h1>
          <p className="text-gray-600 mb-4">
            {(productErrorMessage as Error).message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-600 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-500">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 font-sans bg-white text-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT - Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <img
                src={product.images[currentImageIndex]?.url || "/fallback.png"}
                alt={product.title}
                className="w-full h-96 object-cover transition duration-300"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    currentImageIndex === index
                      ? "border-gray-800"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold">Description</h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <button className="text-sm text-[#773d4c] mt-2 hover:underline">
                Read More
              </button>
            </div>
          </div>

          {/* RIGHT - Details */}
          <div className="space-y-6">
            <div className="uppercase text-sm tracking-wide text-gray-500">
              {product.tags?.[0] ?? "Generic"}
            </div>

            <h1 className="text-3xl font-semibold">{product.title}</h1>

            {/* Rating */}
            {/* <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {product.rating ?? "4.5"}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews ?? "120"} reviews)
              </span>
            </div> */}

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-lg transition ${
                      selectedSize === size
                        ? "bg-[#773d4c] text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  ₹{product.salePrice.toLocaleString()}
                </span>
                {product.regularPrice > product.salePrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.regularPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      ({discountPercentage}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Stock */}
            {/* <div>
              {product.stockQuantity > 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  In Stock ({product.stockQuantity} available)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Out of Stock
                </div>
              )}
            </div> */}

            {/* Offers */}
            <div className="bg-[#f7ebe3] border border-red-200 rounded-lg p-4 text-sm space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-red-700">🎁 2 offers</span>
                <span className="text-red-700">+ 1 free sample</span>
                <button className="ml-auto text-red-700 hover:underline font-medium">
                  View all
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center border-x py-1">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            {/* <div className="flex gap-4">
              <button
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                  product.stockQuantity > 0
                    ? "bg-[#773d4c] text-white hover:bg-[#5f2e38]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={product.stockQuantity <= 0}
              >
                {product.stockQuantity > 0 ? "Add to Bag" : "Out of Stock"}
              </button>
              <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
            </div> */}

            {/* Additional Info */}
            <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
              {product.sku && (
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="text-gray-800">{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-gray-800">{product.category}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex justify-between">
                  <span>Warranty:</span>
                  <span className="text-gray-800">{product.warranty}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Reviews Section - Using Real API */}

      <CustomerReviews
        stats={data.statistics}
        reviews={data.reviews}
        id={id}
        refetch={refetch}
      />
    </div>
  );
};

export default Page;
