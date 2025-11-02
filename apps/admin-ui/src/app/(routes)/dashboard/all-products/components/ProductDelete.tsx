"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export default function ProductDelete({ product, onClose }: any) {
  const handleDelete = () => {
    console.log("Deleted Product:", product);
    onClose();
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2">Delete Product</h3>
      <p className="text-gray-400 mb-6">
        Are you sure you want to delete "{product.name}"? This action cannot be
        undone.
      </p>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
      >
        Delete Product
      </button>
    </div>
  );
}
