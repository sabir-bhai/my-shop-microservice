
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import StatsCards from "./components/StatsCards";
import SearchFilter from "./components/SearchFilter";
import ProductsTable from "./components/ProductsTable";
import ProductModal from "./components/ProductModal";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  regularPrice: number;
  salePrice: number;
  warranty: string;
  category: string;
  sku: string;
  stockQuantity: number;
  discountCode?: string;
  tags: string[];
  publicationStatus: "Draft" | "Published" | "Private";
  featuredProduct: boolean;
  createdAt: string;
  updatedAt: string;
  status?: "Active" | "Inactive";
  images: { id: string; url: string }[];
}

// export interface Product {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   regularPrice: number;
//   salePrice: number;
//   warranty?: string;
//   category: string;
//   sku: string;
//   stockQuantity: number;
//   discountCode?: string;
//   tags?: string[];
//   publicationStatus: string;
//   featuredProduct: boolean;
//   status?: "Active" | "Inactive";
//   images: { id: string; url: string }[];
// }

const API_URL = "http://localhost:8080/product/api";

export default function ProductManagement() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "view" | "edit" | "delete" | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>(API_URL);
      return data;
    },
  });

  // ✅ Update Product
  const updateMutation = useMutation<AxiosResponse, Error, Product>({
    mutationFn: async (updated: Product) =>
      await axios.put(`${API_URL}/${updated.id}`, updated),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ✅ Delete Product
  const deleteMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: async (id: string) => await axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Save handler
  const onSave = (updated: Product) => {
    updateMutation.mutate(updated);
    setShowModal(false);
  };

  // Delete handler
  const onDelete = (id: string) => {
    deleteMutation.mutate(id);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-gray-400">Manage your product inventory</p>
          </div>
          <button className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Loading / Error */}
        {isLoading && <p className="text-gray-400">Loading products...</p>}
        {isError && <p className="text-red-400">❌ Failed to load products.</p>}

        {!isLoading && products.length > 0 && (
          <>
            <StatsCards products={products} />
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <ProductsTable
              products={products}
              searchTerm={searchTerm}
              onAction={(product, action) => {
                setSelectedProduct(product);
                setModalContent(action);
                setShowModal(true);
              }}
            />
          </>
        )}

        {/* Modal */}
        {showModal && selectedProduct && modalContent && (
          <ProductModal
            actionType={modalContent}
            product={selectedProduct}
            onClose={() => setShowModal(false)}
            onSave={onSave}
            onDelete={() => onDelete(selectedProduct.id)}
          />
        )}
      </div>
    </div>
  );
}
