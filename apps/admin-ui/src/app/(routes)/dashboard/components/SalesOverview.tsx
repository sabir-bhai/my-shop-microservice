// components/SalesOverview.tsx
import React from "react";
import { SalesData } from "../types/dashboard";

interface SalesOverviewProps {
  data: SalesData[];
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ data }) => {
  const maxSales = Math.max(...data.map((d) => d.sales));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Sales Overview
          </h3>
          <p className="text-gray-400 text-sm">
            Monthly sales and order trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Sales ($)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Orders</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        {/* SVG Chart */}
        <svg className="w-full h-full" viewBox="0 0 800 200">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y * 2}
              x2="800"
              y2={y * 2}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Sales line */}
          <path
            d={`M ${data
              .map(
                (d, i) =>
                  `${(i * 800) / (data.length - 1)},${
                    200 - (d.sales / maxSales) * 150
                  }`
              )
              .join(" L ")}`}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Sales area fill */}
          <path
            d={`M ${data
              .map(
                (d, i) =>
                  `${(i * 800) / (data.length - 1)},${
                    200 - (d.sales / maxSales) * 150
                  }`
              )
              .join(" L ")} L 800,200 L 0,200 Z`}
            fill="url(#salesGradient)"
            opacity="0.2"
          />

          {/* Orders line */}
          <path
            d={`M ${data
              .map(
                (d, i) =>
                  `${(i * 800) / (data.length - 1)},${
                    200 - (d.orders / 120) * 150
                  }`
              )
              .join(" L ")}`}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="salesGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
          {data.map((d) => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
