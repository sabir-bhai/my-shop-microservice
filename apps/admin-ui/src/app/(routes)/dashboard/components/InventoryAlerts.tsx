// components/InventoryAlerts.tsx
import React from "react";
import { InventoryAlert } from "../types/dashboard";

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ alerts }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return { bg: "bg-yellow-500", text: "text-yellow-400", icon: "⚠️" };
      case "out":
        return { bg: "bg-red-500", text: "text-red-400", icon: "🔴" };
      case "critical":
        return { bg: "bg-orange-500", text: "text-orange-400", icon: "⚡" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-400", icon: "❓" };
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-yellow-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white">Inventory Alerts</h3>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">
            Products requiring immediate attention
          </span>
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const statusStyle = getStatusColor(alert.status);
          return (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${statusStyle.bg}`}></div>
                <div>
                  <h4 className="text-white font-medium">{alert.product}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-400">
                      {alert.category}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-400">
                      Restocked {alert.restockedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-lg font-bold ${statusStyle.text}`}>
                    {alert.stock}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min {alert.minStock}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} text-white`}
                >
                  {alert.status === "out"
                    ? "Out of Stock"
                    : alert.status === "low"
                    ? "Low Stock"
                    : "Critical Stock"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryAlerts;
