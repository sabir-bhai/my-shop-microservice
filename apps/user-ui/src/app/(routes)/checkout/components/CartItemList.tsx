"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice: number;
  discountPercentage?: number;
  category: string;
  quantity: number; // ✅ Make sure this is passed from the parent
  images: { url: string }[];
}

interface CartItemListProps {
  items: Product[];
  onQuantityChange: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="bg-[#ffffff] rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Bag ({items.length} items)
        </h2>
        <button className="text-sm text-[#773d4c] font-medium flex items-center gap-2 hover:underline">
          ❤ ADD ITEMS FROM YOUR WISHLIST
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-6">
            {/* Product Info */}
            <div className="flex gap-4">
              <img
                src={item.images?.[0]?.url ?? "/fallback.png"}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  {item.title.split(" ")[0]}
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {item.title}
                </p>
                <p className="text-xs text-[#773d4c] mt-1">{item.category}</p>

                <div className="mt-2 text-sm">
                  <span className="font-semibold text-gray-900">
                    ₹{item.salePrice.toLocaleString()}
                  </span>
                  <span className="ml-2 line-through text-gray-400">
                    ₹{item.regularPrice.toLocaleString()}
                  </span>
                  {item.discountPercentage && (
                    <span className="ml-2 text-green-600">
                      ({item.discountPercentage}% off)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity + Remove */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-center border rounded-md mt-2">
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-200"
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItemList;
