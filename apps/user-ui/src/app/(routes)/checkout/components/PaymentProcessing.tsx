import React from "react";

const PaymentProcessing = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-stone-300"></div>
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-red-900 animate-spin"></div>
          </div>
        </div>

        {/* Payment Processing Text */}
        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Processing
        </h1>

        {/* Description Text */}
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
          We're verifying the status of your payment. You'll be redirected to
          this page
          <br />
          as soon as we receive a confirmation
        </p>
      </div>
    </div>
  );
};

export default PaymentProcessing;
