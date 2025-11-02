import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

// PaymentProcessing Component
const PaymentProcessing = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-stone-300"></div>
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-red-900 animate-spin"></div>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Processing
        </h1>

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

// PaymentFailed Component
interface PaymentFailedProps {
  onRetry: () => void;
  onGoBack: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ onRetry, onGoBack }) => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center relative">
          <div className="w-16 h-16 rounded-full border-3 border-red-500 bg-white flex items-center justify-center">
            <X className="w-8 h-8 text-red-500 stroke-2" />
          </div>

          <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">J</span>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Failed
        </h1>

        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-8">
          If money is deducted from your account, a refund will be processed
          <br />
          within 2 hours and will be credited in 4-5 business days
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onGoBack}
            className="px-8 py-3 border border-gray-400 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors duration-200"
          >
            GO BACK
          </button>
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-red-800 text-white font-medium rounded hover:bg-red-900 transition-colors duration-200"
          >
            RETRY PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

// PaymentSuccess Component
interface PaymentSuccessProps {
  onContinueShopping: () => void;
  onViewOrder: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  onContinueShopping,
  onViewOrder,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center relative">
          <div className="w-16 h-16 rounded-full border-3 border-green-500 bg-white flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500 stroke-[3]" />
          </div>

          <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">J</span>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-6">
          Payment Successful
        </h1>

        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-2">
          Your payment has been processed successfully.
        </p>
        <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto mb-8">
          Order confirmation has been sent to your email address.
        </p>

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

const MainPaymentComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("processing"); // processing, failed, success
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    // Initial processing for 3 seconds
    if (currentStep === "processing") {
      const timer = setTimeout(() => {
        if (attemptCount === 0) {
          // First attempt - show failed
          setCurrentStep("failed");
          setAttemptCount(1);
        } else if (attemptCount === 1) {
          // Second attempt - show failed again
          setCurrentStep("failed");
          setAttemptCount(2);
        } else {
          // Third attempt - show success
          setCurrentStep("success");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, attemptCount]);

  const handleRetryPayment = () => {
    setCurrentStep("processing");
  };

  const handleGoBack = () => {
    // Reset to initial state
    setCurrentStep("processing");
    setAttemptCount(0);
  };

  const handleContinueShopping = () => {
    // Reset for demo purposes
    setCurrentStep("processing");
    setAttemptCount(0);
  };

  const handleViewOrder = () => {
    // Reset for demo purposes
    setCurrentStep("processing");
    setAttemptCount(0);
  };

  // Render current step
  switch (currentStep) {
    case "processing":
      return <PaymentProcessing />;

    case "failed":
      return (
        <PaymentFailed onRetry={handleRetryPayment} onGoBack={handleGoBack} />
      );

    case "success":
      return (
        <PaymentSuccess
          onContinueShopping={handleContinueShopping}
          onViewOrder={handleViewOrder}
        />
      );

    default:
      return <PaymentProcessing />;
  }
};

export default MainPaymentComponent;
