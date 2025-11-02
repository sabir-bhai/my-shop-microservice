// components/MetricCard.tsx
import React from "react";
import { MetricCard as MetricCardType } from "../types/dashboard";

interface MetricCardProps {
  metric: MetricCardType;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "dollar":
        return (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case "cart":
        return (
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h2M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "users":
        return (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      case "package":
        return (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getIconColor = (iconType: string) => {
    switch (iconType) {
      case "dollar":
        return "text-green-500";
      case "cart":
        return "text-blue-500";
      case "users":
        return "text-purple-500";
      case "package":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`${getIconColor(metric.icon)} bg-gray-700 p-2 rounded-lg`}
        >
          {getIcon(metric.icon)}
        </div>
        <div className="flex items-center">
          <svg
            className={`w-4 h-4 mr-1 ${
              metric.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                metric.change >= 0
                  ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              }
            />
          </svg>
          <span
            className={`text-sm font-medium ${
              metric.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {metric.change >= 0 ? "+" : ""}
            {metric.change}%
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
        <p className="text-gray-400 text-sm">{metric.title}</p>
      </div>
    </div>
  );
};

export default MetricCard;
