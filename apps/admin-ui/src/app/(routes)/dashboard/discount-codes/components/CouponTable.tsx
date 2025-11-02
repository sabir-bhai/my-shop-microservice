"use client";

import React, { useState } from "react";
import { MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Coupon } from "../types/coupon";
import { Badge } from "../ui/index";

interface CouponTableProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDuplicate: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (couponId: string) => {
    setActiveDropdown(activeDropdown === couponId ? null : couponId);
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}%`;
    } else if (coupon.type === "fixed") {
      return `$${coupon.value}`;
    }
    return coupon.value;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { variant: "active" as const, text: "Active" },
      scheduled: { variant: "scheduled" as const, text: "Scheduled" },
      draft: { variant: "draft" as const, text: "Draft" },
      expired: { variant: "expired" as const, text: "Expired" },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      variant: "draft" as const,
      text: status,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className=" divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Valid Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {coupon.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {coupon.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                {coupon.type.replace("_", " ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatValue(coupon)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {getStatusBadge(coupon.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {coupon.usage.current} / {coupon.usage.total || "∞"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div>
                  <div>
                    From:{" "}
                    {new Date(coupon.validPeriod.from).toLocaleDateString()}
                  </div>
                  <div>
                    Until:{" "}
                    {coupon.validPeriod.until
                      ? new Date(coupon.validPeriod.until).toLocaleDateString()
                      : "No limit"}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                <button
                  onClick={() => toggleDropdown(coupon.id)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeDropdown === coupon.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onEdit(coupon);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                      >
                        <Pencil className="w-4 h-4 mr-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDuplicate(coupon);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                      >
                        <Copy className="w-4 h-4 mr-3" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => {
                          onDelete(coupon.id);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;
