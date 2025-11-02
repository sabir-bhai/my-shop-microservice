"use client";

import React from "react";
import { X } from "lucide-react";
import ProductView from "./ProductView";
import ProductEdit from "./ProductEdit";
import ProductDelete from "./ProductDelete";
import { Product } from "../page";

interface ProductModalProps {
  actionType: "view" | "edit" | "delete";
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void;
  onDelete: () => void;
}

export default function ProductModal({
  actionType,
  product,
  onClose,
  onSave,
}: ProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold capitalize">{actionType} Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {actionType === "view" && <ProductView product={product} />}
          {actionType === "edit" && (
            <ProductEdit product={product} onClose={onClose} onSave={onSave} />
          )}
          {actionType === "delete" && (
            <ProductDelete product={product} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
