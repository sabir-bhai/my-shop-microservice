"use client";
import React from "react";
import { Info } from "lucide-react";
import Image from "next/image";
type ProductImage = {
  id?: string;
  url: string;
};
type Product = {
  id: string;
  title: string;
  salePrice: number;
  regularPrice: number;
  brand?: string;
  size?: string;
  quantity: number;
  images: ProductImage[];
};

interface MyOrderSummaryProps {
  cartItems: Product[];
  totalAmount: number;
  totalMRP: number;
  discount: number;
  shippingFee?: number;
  handleNext: () => void;
  processedToPay: () => void;
}

const MyOrderSummary: React.FC<MyOrderSummaryProps> = ({
  cartItems,
  totalAmount,
  totalMRP,
  discount,
  shippingFee = 50,
  handleNext,
  processedToPay,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Summary{" "}
          <span className="text-sm font-normal text-gray-500">
            ({cartItems.length} items)
          </span>
        </h2>
      </div>

      <div className="max-h-80 overflow-y-auto">
        <div className="p-4 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              {/* <div className="w-12 h-12 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 bg-amber-200 rounded"></div>
              </div> */}

              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src={item.images?.[0]?.url || "/fallback.png"} // fallback if image is missing
                  alt={item.title}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  {item.brand || "Generic Brand"}
                </p>
                <p className="text-sm text-gray-900 leading-tight mb-2">
                  {item.title}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{item.size || "N/A"}</span>
                    <span>QTY: {item.quantity}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{item.salePrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border-t border-gray-200">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Price Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Total MRP</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-900">
                ₹{totalMRP.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Selling Price of Items
              </span>
              <span className="text-sm text-gray-900">
                ₹{(totalMRP - discount).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Discount</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-green-600">-₹{discount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Shipping Fee</div>
                <div className="text-xs text-gray-500">(Standard Shipping)</div>
              </div>
              <span className="text-sm text-gray-900">₹{shippingFee}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ₹{(totalAmount + shippingFee).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4">
          <button
            className="w-full bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-4 rounded transition-colors duration-200"
            onClick={() => {
              handleNext();
              processedToPay();
            }}
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOrderSummary;
