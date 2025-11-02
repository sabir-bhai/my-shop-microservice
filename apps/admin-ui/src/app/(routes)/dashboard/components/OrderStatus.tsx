// components/OrderStatus.tsx
import React from "react";
import { OrderStatus as OrderStatusType } from "../types/dashboard";

interface OrderStatusProps {
  orderStatuses: OrderStatusType[];
  totalOrders: number;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  orderStatuses,
  totalOrders,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Order Status
          </h3>
          <p className="text-gray-400 text-sm">Current order distribution</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalOrders}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {orderStatuses.map((status, index) => {
              const offset = orderStatuses
                .slice(0, index)
                .reduce((acc, curr) => acc + curr.percentage, 0);
              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = `${
                (status.percentage / 100) * circumference
              } ${circumference}`;
              const strokeDashoffset = -((offset / 100) * circumference);

              return (
                <circle
                  key={status.status}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={status.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-3">
        {orderStatuses.map((status) => (
          <div
            key={status.status}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: status.color }}
              ></div>
              <span className="text-gray-300 text-sm">{status.status}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">{status.count}</span>
              <span className="text-gray-400 text-sm w-12 text-right">
                {status.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
