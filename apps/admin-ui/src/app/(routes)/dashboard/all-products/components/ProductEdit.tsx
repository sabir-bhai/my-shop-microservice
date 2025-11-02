"use client";

import React from "react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Product } from "../page";

interface ProductEditProps {
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

export default function ProductEdit({
  product,
  onClose,
  onSave,
}: ProductEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: product,
  });

  const onSubmit = (data: Product) => {
    console.log("✅ Updated Product:", data);
    onSave(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Product Title */}
      <div>
        <input
          type="text"
          {...register("title", { required: "Product title is required" })}
          placeholder="Product Title"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <input
          type="text"
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug must be lowercase and may include dashes",
            },
          })}
          placeholder="Slug"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.slug && (
          <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <input
          type="text"
          {...register("category", { required: "Category is required" })}
          placeholder="Category"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Sale Price */}
      <div>
        <input
          type="number"
          step="0.01"
          {...register("salePrice", {
            required: "Sale price is required",
            min: { value: 0, message: "Price must be at least 0" },
          })}
          placeholder="Sale Price"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.salePrice && (
          <p className="text-red-400 text-sm mt-1">
            {errors.salePrice.message}
          </p>
        )}
      </div>

      {/* Regular Price */}
      <div>
        <input
          type="number"
          step="0.01"
          {...register("regularPrice", {
            required: "Regular price is required",
            min: { value: 0, message: "Regular price must be at least 0" },
          })}
          placeholder="Regular Price"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.regularPrice && (
          <p className="text-red-400 text-sm mt-1">
            {errors.regularPrice.message}
          </p>
        )}
      </div>

      {/* Stock Quantity */}
      <div>
        <input
          type="number"
          {...register("stockQuantity", {
            required: "Stock quantity is required",
            min: { value: 0, message: "Stock cannot be negative" },
          })}
          placeholder="Stock Quantity"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.stockQuantity && (
          <p className="text-red-400 text-sm mt-1">
            {errors.stockQuantity.message}
          </p>
        )}
      </div>

      {/* Publication Status */}
      <div>
        <select
          {...register("publicationStatus", { required: "Status is required" })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Private">Private</option>
        </select>
        {errors.publicationStatus && (
          <p className="text-red-400 text-sm mt-1">
            {errors.publicationStatus.message}
          </p>
        )}
      </div>

      {/* Warranty */}
      <div>
        <input
          type="text"
          {...register("warranty", { required: "Warranty is required" })}
          placeholder="Warranty"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg"
        />
        {errors.warranty && (
          <p className="text-red-400 text-sm mt-1">{errors.warranty.message}</p>
        )}
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
      >
        <Save className="w-4 h-4 mr-2" /> Save Changes
      </button>
    </form>
  );
}
