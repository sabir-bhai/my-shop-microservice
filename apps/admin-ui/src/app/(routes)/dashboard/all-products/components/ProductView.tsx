"use client";

import React from "react";

export default function ProductView({ product }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
          {product.image}
        </div>
        <div>
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-gray-400">{product.slug}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Category: {product.category}</p>
        </div>
        <div>
          <p>Status: {product.status}</p>
        </div>
        <div>
          <p>Price: ${product.price}</p>
        </div>
        <div>
          <p>Original Price: ${product.originalPrice}</p>
        </div>
        <div>
          <p>Stock: {product.stock}</p>
        </div>
        <div>
          <p>Warranty: {product.warranty}</p>
        </div>
      </div>
    </div>
  );
}
