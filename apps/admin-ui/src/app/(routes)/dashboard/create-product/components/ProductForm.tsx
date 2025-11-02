"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Package, Percent, Tag, ChevronDown } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

interface FormData {
  title: string;
  slug: string;
  description: string;
  regularPrice: string;
  salePrice: string;
  warranty: string;
  category: string;
  sku: string;
  stockQuantity: string;
  discountCode: string;
  tags: string;
  publicationStatus: string;
  featuredProduct: boolean;
}

interface ProductFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export default function ProductForm({
  register,
  errors,
  watch,
  setValue,
}: ProductFormProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <Package className="w-5 h-5 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold">Product Information</h2>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Slug must be lowercase with dashes",
              },
            })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
          />
          {errors.slug && (
            <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Must be at least 10 characters",
              },
            })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg resize-none"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Regular Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register("regularPrice", {
                required: "Regular price required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
            />
            {errors.regularPrice && (
              <p className="text-red-400 text-sm mt-1">
                {errors.regularPrice.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sale Price <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("salePrice", {
                required: "Sale price required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
            />
            {errors.salePrice && (
              <p className="text-red-400 text-sm mt-1">
                {errors.salePrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Warranty & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Warranty</label>
            <input
              type="text"
              {...register("warranty")}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg appearance-none"
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* SKU & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text"
              {...register("sku")}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              {...register("stockQuantity", {
                required: "Stock is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
            />
            {errors.stockQuantity && (
              <p className="text-red-400 text-sm mt-1">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>
        </div>

        {/* Discount Code & Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Discount Code
          </label>
          <input
            type="text"
            {...register("discountCode")}
            placeholder="Add discount code..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            {...register("tags")}
            placeholder="Add tags..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
          />
        </div>

        {/* Publication */}
        <div>
          <label className="block text-sm font-medium mb-2">Publication</label>
          <select
            {...register("publicationStatus")}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Private">Private</option>
          </select>
        </div>

        {/* Featured */}
        <div>
          <label className="block text-sm font-medium mb-2">Featured</label>
          <ToggleSwitch
            enabled={watch("featuredProduct")}
            onToggle={() =>
              setValue("featuredProduct", !watch("featuredProduct"))
            }
          />
        </div>
      </div>
    </div>
  );
}
