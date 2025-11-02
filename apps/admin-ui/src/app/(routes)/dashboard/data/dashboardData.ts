// data/dashboardData.ts
import {
  MetricCard,
  SalesData,
  OrderStatus,
  RecentActivity,
  InventoryAlert,
  CustomerAnalytics,
  CustomerAcquisition,
  TopProduct,
} from "../types/dashboard";

export const metricCards: MetricCard[] = [
  {
    id: "1",
    title: "Total Revenue",
    value: "$54,239",
    change: 12.5,
    icon: "dollar",
  },
  {
    id: "2",
    title: "Orders",
    value: "1,429",
    change: 8.2,
    icon: "cart",
  },
  {
    id: "3",
    title: "Customers",
    value: "2,845",
    change: -2.1,
    icon: "users",
  },
  {
    id: "4",
    title: "Products",
    value: "892",
    change: 5.4,
    icon: "package",
  },
];

export const salesData: SalesData[] = [
  { month: "Jan", sales: 3500, orders: 45 },
  { month: "Feb", sales: 2800, orders: 38 },
  { month: "Mar", sales: 4200, orders: 55 },
  { month: "Apr", sales: 3800, orders: 48 },
  { month: "May", sales: 5500, orders: 72 },
  { month: "Jun", sales: 6200, orders: 81 },
  { month: "Jul", sales: 6800, orders: 89 },
  { month: "Aug", sales: 7200, orders: 94 },
  { month: "Sep", sales: 7800, orders: 102 },
  { month: "Oct", sales: 8200, orders: 107 },
  { month: "Nov", sales: 8800, orders: 115 },
  { month: "Dec", sales: 9200, orders: 120 },
];

export const orderStatuses: OrderStatus[] = [
  { status: "Delivered", count: 450, percentage: 49.7, color: "#10B981" },
  { status: "In Transit", count: 230, percentage: 25.4, color: "#8B5CF6" },
  { status: "Processing", count: 120, percentage: 13.3, color: "#F59E0B" },
  { status: "Pending", count: 80, percentage: 8.8, color: "#F97316" },
  { status: "Cancelled", count: 25, percentage: 2.8, color: "#EF4444" },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    action: "placed a new order",
    item: "Wireless Headphones",
    price: 299.99,
    time: "2 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    user: "Mike Chen",
    action: "requested a refund for",
    item: "Smart Watch",
    price: 199.99,
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: "3",
    user: "Emma Davis",
    action: "left a review for",
    item: "Laptop Stand",
    price: 49.99,
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: "4",
    user: "Alex Rodriguez",
    action: "updated their profile",
    item: "Account Settings",
    price: 0,
    time: "2 hours ago",
    status: "completed",
  },
];

export const inventoryAlerts: InventoryAlert[] = [
  {
    id: "1",
    product: "Wireless Headphones Pro",
    sku: "WHP-001",
    category: "Electronics",
    stock: 5,
    minStock: 10,
    status: "low",
    restockedDate: "2 days ago",
  },
  {
    id: "2",
    product: "Smart Watch Series X",
    sku: "SWX-002",
    category: "Wearables",
    stock: 0,
    minStock: 15,
    status: "out",
    restockedDate: "1 week ago",
  },
  {
    id: "3",
    product: "Gaming Mouse Pro",
    sku: "GMP-003",
    category: "Gaming",
    stock: 3,
    minStock: 8,
    status: "critical",
    restockedDate: "3 days ago",
  },
  {
    id: "4",
    product: "USB-C Cable 2m",
    sku: "USC-004",
    category: "Accessories",
    stock: 12,
    minStock: 25,
    status: "low",
    restockedDate: "5 days ago",
  },
];

export const customerAnalytics: CustomerAnalytics = {
  totalCustomers: 12847,
  newCustomers: 1234,
  returningRate: 67.8,
  avgOrderValue: 84.5,
  changes: {
    totalCustomers: 8.2,
    newCustomers: 15.3,
    returningRate: 2.1,
    avgOrderValue: 5.3,
  },
};

export const customerAcquisitionData: CustomerAcquisition[] = [
  { month: "Jan", new: 120, returning: 340 },
  { month: "Feb", new: 140, returning: 380 },
  { month: "Mar", new: 160, returning: 420 },
  { month: "Apr", new: 180, returning: 450 },
  { month: "May", new: 200, returning: 520 },
  { month: "Jun", new: 220, returning: 580 },
];

export const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    category: "Electronics",
    rating: 4.8,
    revenue: 36999,
    sales: 1234,
    change: 12.5,
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    category: "Wearables",
    rating: 4.6,
    revenue: 29610,
    sales: 987,
    change: 8.3,
  },
  {
    id: "3",
    name: "Gaming Laptop Ultra",
    category: "Computers",
    rating: 4.9,
    revenue: 68400,
    sales: 456,
    change: -2.1,
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    category: "Audio",
    rating: 4.4,
    revenue: 15780,
    sales: 789,
    change: 15.7,
  },
  {
    id: "5",
    name: "Smartphone Case",
    category: "Accessories",
    rating: 4.2,
    revenue: 12936,
    sales: 2156,
    change: 23.4,
  },
];
