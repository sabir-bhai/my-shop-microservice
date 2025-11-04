"use client";

import React from "react";
import { Trash2, Heart, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  salePrice: number;
  regularPrice: number;
  discountPercentage?: number;
  category: string;
  quantity: number;
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
  const calculateDiscount = (regular: number, sale: number) => {
    return Math.round(((regular - sale) / regular) * 100);
  };

  return (
    <div className="bg-surface-10 rounded-xl shadow-BagBoxShadow overflow-hidden">
      {/* Header */}
    

      {/* Items List */}
      <div className="divide-y divide-neutral-10">
        {items.map((item, index) => {
          const discount = item.discountPercentage || calculateDiscount(item.regularPrice, item.salePrice);

          return (
            <div
              key={item.id}
              className="px-6 py-6 hover:bg-primary-20 transition-all duration-300 group"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-custom group-hover:shadow-lg transition-all duration-300">
                    <img
                      src={item.images?.[0]?.url ?? "/fallback.png"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {discount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-error-40 text-surface-10 rounded-full px-2 py-1 paragraph-09-medium shadow-lg">
                      -{discount}%
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-4">
                      <p className="paragraph-09-medium text-neutral-40 uppercase tracking-wider mb-1">
                        {item.title.split(" ")[0]}
                      </p>
                      <h3 className="sub-heading-04-bold text-neutral-90 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="paragraph-07-regular text-secondary-60 flex items-center gap-1">
                        <span className="w-2 h-2 bg-secondary-60 rounded-full"></span>
                        {item.category}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-neutral-40 hover:text-error-40 hover:bg-error-10 rounded-lg transition-all duration-300 group/delete"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Price and Quantity Section */}
                  <div className="flex justify-between items-end mt-4">
                    {/* Price */}
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="sub-heading-02-bold text-neutral-90">
                          ₹{item.salePrice.toLocaleString()}
                        </span>
                        {item.regularPrice > item.salePrice && (
                          <span className="paragraph-07-regular line-through text-neutral-30">
                            ₹{item.regularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <span className="paragraph-09-medium text-success-40 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          You save ₹{(item.regularPrice - item.salePrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-primary-30 rounded-lg px-1 py-1 shadow-sm">
                      <button
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-surface-10 text-secondary-60 hover:bg-secondary-60 hover:text-surface-10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="paragraph-05-medium text-neutral-90 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-surface-10 text-secondary-60 hover:bg-secondary-60 hover:text-surface-10 transition-all duration-300 shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="mt-3 pt-3 border-t border-neutral-10">
                    <div className="flex justify-between items-center">
                      <span className="paragraph-07-regular text-neutral-40">
                        Subtotal ({item.quantity} {item.quantity === 1 ? 'item' : 'items'})
                      </span>
                      <span className="paragraph-06-medium text-neutral-90">
                        ₹{(item.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Add from Wishlist CTA */}
      {items.length > 0 && (
        <div className="bg-primary-20 px-6 py-4 border-t border-neutral-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary-60" />
              <span className="paragraph-06-regular text-neutral-60">
                Found something you love?
              </span>
            </div>
            <button className="paragraph-06-medium text-secondary-60 hover:text-secondary-70 underline transition-colors">
              Add from Wishlist →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemList;
