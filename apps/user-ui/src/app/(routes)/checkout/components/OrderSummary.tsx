import React, { useState } from "react";
import { Tag, Gift, Truck, Shield, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  onChooseAddress: () => void;
  totalMrp: number;
  totalDiscount: number;
  totalAmount: number;
};

const OrderSummary: React.FC<Props> = ({
  onChooseAddress,
  totalMrp,
  totalDiscount,
  totalAmount,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      // Add your coupon application logic here
    }
  };

  const savingsPercentage =
    totalMrp > 0 ? Math.round((totalDiscount / totalMrp) * 100) : 0;

  return (
    <div className="lg:w-96">
      <div className="bg-surface-10 rounded-xl shadow-BagBoxShadowV2 overflow-hidden sticky top-6 flex flex-col ">
        {/* Header */}
        <div className="bg-gradient-to-br from-secondary-60 to-secondary-50 px-6 py-4 flex-shrink-0">
          <h3 className="sub-heading-01-bold text-surface-10 flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Order Summary
          </h3>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Coupon Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="paragraph-05-medium text-neutral-80 flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary-60" />
                Apply Coupon
              </h4>
              {appliedCoupon && (
                <span className="paragraph-09-medium text-success-40 bg-success-10 px-2 py-1 rounded-full">
                  Applied!
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="w-full h-11 px-4 paragraph-06-regular border-2 border-neutral-10 focus:border-secondary-60 rounded-lg outline-none transition-all duration-300 bg-surface-10"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-success-40"
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
                  </div>
                )}
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || !!appliedCoupon}
                className="paragraph-06-medium bg-secondary-60 text-surface-10 h-11 px-6 rounded-lg hover:bg-secondary-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
              >
                APPLY
              </button>
            </div>

            {/* Available Offers */}
            <div className="bg-tertiary-10 rounded-lg p-3 border border-tertiary-30">
              <div className="flex items-start gap-2">
                <Gift className="w-4 h-4 text-tertiary-60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="paragraph-07-medium text-tertiary-90">
                    2 offers available
                  </p>
                  <button className="paragraph-09-medium text-secondary-60 hover:underline mt-1">
                    View all offers →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="space-y-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between paragraph-05-medium text-neutral-80 hover:text-secondary-60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Price Details
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-3 pt-2 border-t border-neutral-10">
                {/* Total MRP */}
                <div className="flex justify-between items-center">
                  <span className="paragraph-06-regular text-neutral-40">
                    Total MRP
                  </span>
                  <span className="paragraph-06-medium text-neutral-90">
                    ₹{totalMrp.toLocaleString()}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                  <span className="paragraph-06-regular text-neutral-40 flex items-center gap-1">
                    Discount
                    {savingsPercentage > 0 && (
                      <span className="paragraph-09-medium text-success-40 bg-success-10 px-2 py-0.5 rounded-full ml-1">
                        {savingsPercentage}% off
                      </span>
                    )}
                  </span>
                  <span className="paragraph-06-medium text-success-40">
                    −₹{totalDiscount.toLocaleString()}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center py-2 bg-primary-20 -mx-4 px-4 rounded-lg">
                  <span className="paragraph-06-regular text-neutral-60">
                    Subtotal
                  </span>
                  <span className="paragraph-06-medium text-neutral-90">
                    ₹{(totalMrp - totalDiscount).toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="paragraph-06-regular text-neutral-40 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping Fee
                  </span>
                  <span className="paragraph-06-medium text-success-40 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    FREE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Total Amount - Always Visible */}
          <div className="pt-4 border-t-2 border-secondary-60">
            <div className="flex justify-between items-center mb-2">
              <span className="sub-heading-04-bold text-neutral-90">
                Total Amount
              </span>
              <div className="text-right">
                <span className="sub-heading-02-bold text-secondary-60">
                  ₹{totalAmount.toLocaleString()}
                </span>
                {totalDiscount > 0 && (
                  <p className="paragraph-09-medium text-success-40 mt-1">
                    You saved ₹{totalDiscount.toLocaleString()}!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-primary-20 to-primary-30 rounded-lg p-4 space-y-2 border border-primary-60">
            <div className="flex items-center gap-2 paragraph-07-regular text-neutral-70">
              <Shield className="w-4 h-4 text-secondary-60" />
              <span>Safe and Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 paragraph-07-regular text-neutral-70">
              <Truck className="w-4 h-4 text-secondary-60" />
              <span>Free Shipping on orders above ₹999</span>
            </div>
            <div className="flex items-center gap-2 paragraph-07-regular text-neutral-70">
              <svg
                className="w-4 h-4 text-secondary-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Easy 30 Days Return Policy</span>
            </div>
          </div>
        </div>

        {/* Checkout Button - Sticky at Bottom */}
        <div className="flex-shrink-0 border-t border-neutral-10 bg-surface-10">
          <button
            onClick={onChooseAddress}
            className="w-full text-surface-10 paragraph-05-medium h-12 rounded-lg transition-all duration-300 shadow-custom hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            style={{ backgroundColor: "#773D4C" }}
          >
            <span>PROCEED TO CHECKOUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
