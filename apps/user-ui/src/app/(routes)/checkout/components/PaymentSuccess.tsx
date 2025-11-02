import React from "react";
import { Check } from "lucide-react";

interface PaymentSuccessProps {
  onContinueShopping?: () => void;
  onViewOrder?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  onContinueShopping,
  onViewOrder,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        {/* Success Icon with User Avatar */}
        <div className="mb-8 flex justify-center relative">
          {/* Main Success Icon */}
          <div className="w-16 h-16 rounded-full border-3 border-green-500 bg-white flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500 stroke-[3]" />
          </div>

          {/* User Avatar - positioned top right */}
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">J</span>
          </div>
        </div>

        {/* Payment Success Text */}
        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Successful
        </h1>

        {/* Description Text */}
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-2">
          Your payment has been processed successfully.
        </p>
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-8">
          Order confirmation has been sent to your email address.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onContinueShopping}
            className="px-8 py-3 border border-gray-400 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors duration-200"
          >
            CONTINUE SHOPPING
          </button>
          <button
            onClick={onViewOrder}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors duration-200"
          >
            VIEW ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
