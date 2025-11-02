import React from "react";
import MetricCard from "./components/MetricCard";
import SalesOverview from "./components/SalesOverview";
import OrderStatus from "./components/OrderStatus";
import RecentActivity from "./components/RecentActivity";
import InventoryAlerts from "./components/InventoryAlerts";
import CustomerAnalytics from "./components/CustomerAnalytics";
import TopProducts from "./components/TopProducts";
import {
  metricCards,
  salesData,
  orderStatuses,
  recentActivities,
  inventoryAlerts,
  customerAnalytics,
  customerAcquisitionData,
  topProducts,
} from "./data/dashboardData";
const page = () => {
  const totalOrders = orderStatuses.reduce(
    (sum, status) => sum + status.count,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-purple-100 text-lg">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Sales Overview */}
      <div className="mb-8">
        <SalesOverview data={salesData} />
      </div>

      {/* Second Row - Order Status, Recent Activity, Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <OrderStatus orderStatuses={orderStatuses} totalOrders={totalOrders} />
        <RecentActivity activities={recentActivities} />
        <InventoryAlerts alerts={inventoryAlerts} />
      </div>

      {/* Third Row - Customer Analytics and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerAnalytics
          analytics={customerAnalytics}
          acquisitionData={customerAcquisitionData}
        />
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
};

export default page;
