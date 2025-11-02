"use client";

import React from "react";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Create New Product
      </h1>
      <p className="text-gray-400">
        Add a new product to your inventory with images and details
      </p>
    </div>
  );
}
