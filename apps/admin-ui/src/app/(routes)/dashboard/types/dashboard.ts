// types/dashboard.ts
export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: "dollar" | "cart" | "users" | "package";
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface OrderStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  item: string;
  price: number;
  time: string;
  status: "completed" | "pending" | "cancelled";
}

export interface InventoryAlert {
  id: string;
  product: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  status: "low" | "out" | "critical";
  restockedDate: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningRate: number;
  avgOrderValue: number;
  changes: {
    totalCustomers: number;
    newCustomers: number;
    returningRate: number;
    avgOrderValue: number;
  };
}

export interface CustomerAcquisition {
  month: string;
  new: number;
  returning: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  rating: number;
  revenue: number;
  sales: number;
  change: number;
}
