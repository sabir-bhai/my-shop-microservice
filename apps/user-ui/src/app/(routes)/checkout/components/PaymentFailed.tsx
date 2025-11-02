"use client";
import React from "react";
import { X } from "lucide-react";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        {/* Error Icon with User Avatar */}
        <div className="mb-8 flex justify-center relative">
          {/* Main Error Icon */}
          <div className="w-16 h-16 rounded-full border-3 border-red-500 bg-white flex items-center justify-center">
            <X className="w-8 h-8 text-red-500 stroke-2" />
          </div>

          {/* User Avatar - positioned top right */}
        </div>

        {/* Payment Failed Text */}
        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Failed
        </h1>

        {/* Description Text */}
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-8">
          If money is deducted from your account, a refund will be processed
          <br />
          within 2 hours and will be credited in 4-5 business days
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 border border-gray-400 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors duration-200">
            GO BACK
          </button>
          <button className="px-8 py-3 bg-red-800 text-white font-medium rounded hover:bg-red-900 transition-colors duration-200">
            RETRY PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
