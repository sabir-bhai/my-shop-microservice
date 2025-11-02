// components/CustomerAnalytics.tsx
import React from "react";
import {
  CustomerAnalytics as CustomerAnalyticsType,
  CustomerAcquisition,
} from "../types/dashboard";

interface CustomerAnalyticsProps {
  analytics: CustomerAnalyticsType;
  acquisitionData: CustomerAcquisition[];
}

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  analytics,
  acquisitionData,
}) => {
  const maxValue = Math.max(
    ...acquisitionData.flatMap((d) => [d.new, d.returning])
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-purple-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white">
            Customer Analytics
          </h3>
        </div>
        <p className="text-gray-400 text-sm">
          Customer acquisition and retention insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-blue-500 mr-1"
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
            <span
              className={`text-xs font-medium ${
                analytics.changes.totalCustomers >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {analytics.changes.totalCustomers >= 0 ? "+" : ""}
              {analytics.changes.totalCustomers}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.totalCustomers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Customers</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-green-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span
              className={`text-xs font-medium ${
                analytics.changes.newCustomers >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {analytics.changes.newCustomers >= 0 ? "+" : ""}
              {analytics.changes.newCustomers}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.newCustomers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">New Customers</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-orange-500 mr-1"
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
            <span
              className={`text-xs font-medium ${
                analytics.changes.returningRate >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {analytics.changes.returningRate >= 0 ? "+" : ""}
              {analytics.changes.returningRate}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.returningRate}%
          </div>
          <div className="text-xs text-gray-400">Returning Rate</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-purple-500 mr-1"
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
            <span
              className={`text-xs font-medium ${
                analytics.changes.avgOrderValue >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {analytics.changes.avgOrderValue >= 0 ? "+" : ""}
              {analytics.changes.avgOrderValue}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${analytics.avgOrderValue}
          </div>
          <div className="text-xs text-gray-400">Avg Order Value</div>
        </div>
      </div>

      {/* Customer Acquisition Trends */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-white">
            Customer Acquisition Trends
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">New</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Returning</span>
            </div>
          </div>
        </div>

        <div className="relative h-48">
          <div className="flex items-end justify-between h-full space-x-2">
            {acquisitionData.map((data) => (
              <div
                key={data.month}
                className="flex flex-col items-center flex-1"
              >
                <div className="flex flex-col items-center w-full mb-2">
                  {/* Returning customers bar */}
                  <div
                    className="w-full bg-purple-400 rounded-t-sm"
                    style={{ height: `${(data.returning / maxValue) * 120}px` }}
                  ></div>
                  {/* New customers bar */}
                  <div
                    className="w-full bg-purple-500 rounded-b-sm"
                    style={{ height: `${(data.new / maxValue) * 120}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
