"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

import { Button, Input, Select, Textarea, Checkbox } from "../ui/index";
import { CouponFormData } from "../types/coupon";

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => void;
  initialData?: Partial<CouponFormData>;
  title?: string;
}

const CouponForm: React.FC<CouponFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Create New Coupon",
}) => {
  const [formData, setFormData] = useState<CouponFormData>({
    code: initialData?.code || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "percentage",
    value: initialData?.value || 0,
    status: initialData?.status || "draft",
    validPeriod: {
      from:
        initialData?.validPeriod?.from ||
        new Date().toISOString().split("T")[0],
      until: initialData?.validPeriod?.until || "",
    },
    rules: {
      minOrderAmount: initialData?.rules?.minOrderAmount || 0,
      maxDiscount: initialData?.rules?.maxDiscount,
      firstTimeOnly: initialData?.rules?.firstTimeOnly || false,
      canCombine: initialData?.rules?.canCombine || false,
    },
    limits: {
      totalUsage: initialData?.limits?.totalUsage,
      usagePerCustomer: initialData?.limits?.usagePerCustomer,
    },
    activateImmediately: initialData?.activateImmediately || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      status: "draft",
      validPeriod: {
        from: new Date().toISOString().split("T")[0],
        until: "",
      },
      rules: {
        minOrderAmount: 0,
        maxDiscount: undefined,
        firstTimeOnly: false,
        canCombine: false,
      },
      limits: {
        totalUsage: undefined,
        usagePerCustomer: undefined,
      },
      activateImmediately: false,
    });
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CouponFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      status: "draft",
      validPeriod: {
        from: new Date().toISOString().split("T")[0],
        until: "",
      },
      rules: {
        minOrderAmount: 0,
        maxDiscount: undefined,
        firstTimeOnly: false,
        canCombine: false,
      },
      limits: {
        totalUsage: undefined,
        usagePerCustomer: undefined,
      },
      activateImmediately: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-gray-800 px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center border-b border-gray-700 pb-2">
                  <span className="text-purple-400 mr-2">$</span>
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Coupon Code*
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange("code", e.target.value)
                        }
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="SAVE20"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-r-md border border-l-0 border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Display Name*
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="20% Off Summer Sale"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                    rows={3}
                    placeholder="Internal description for this coupon..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Discount Type*
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="percentage">% Percentage Off</option>
                      <option value="fixed">$ Fixed Amount</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>

                  {/* Value */}
                  {formData.type !== "free_shipping" && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">
                        {formData.type === "percentage"
                          ? "Percentage (%)"
                          : "Amount ($)"}
                        *
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) =>
                          handleInputChange("value", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        step={formData.type === "percentage" ? "1" : "0.01"}
                        placeholder="0"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Rules & Eligibility Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Rules & Eligibility
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Minimum Order Amount */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Minimum Order Amount ($)
                    </label>
                    <input
                      type="number"
                      value={formData.rules?.minOrderAmount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "rules.minOrderAmount",
                          Number(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </div>

                  {/* Maximum Discount */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Maximum Discount ($)
                    </label>
                    <input
                      type="number"
                      value={formData.rules?.maxDiscount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "rules.maxDiscount",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* First-time customers only */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rules?.firstTimeOnly || false}
                      onChange={(e) =>
                        handleInputChange(
                          "rules.firstTimeOnly",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">
                      First-time customers only
                    </span>
                  </label>

                  {/* Can be combined */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rules?.canCombine || false}
                      onChange={(e) =>
                        handleInputChange("rules.canCombine", e.target.checked)
                      }
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">
                      Can be combined with other offers
                    </span>
                  </label>
                </div>
              </div>

              {/* Limits & Usage Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                  Limits & Usage
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Usage Limit */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.limits?.totalUsage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "limits.totalUsage",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>

                  {/* Usage Per Customer */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Usage Per Customer
                    </label>
                    <input
                      type="number"
                      value={formData.limits?.usagePerCustomer || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "limits.usagePerCustomer",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center border-b border-gray-700 pb-2">
                  <span className="text-purple-400 mr-2">📅</span>
                  Scheduling
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Valid From */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Valid From*
                    </label>
                    <input
                      type="date"
                      value={formData.validPeriod.from}
                      onChange={(e) =>
                        handleInputChange("validPeriod.from", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent [color-scheme:dark]"
                      required
                    />
                  </div>

                  {/* Valid Until */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.validPeriod.until}
                      onChange={(e) =>
                        handleInputChange("validPeriod.until", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent [color-scheme:dark]"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>

                {/* Activate Immediately */}
                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activateImmediately || false}
                      onChange={(e) =>
                        handleInputChange(
                          "activateImmediately",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">
                      Activate coupon immediately
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
