export type OrderStatus =
  | "delivered"
  | "processing"
  | "shipped"
  | "pending"
  | "cancelled"
  | "paid";

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  city: string;
  state: string;
  zip: string;
}

export interface OrderItem {
  name: string;
  sku: string;
  price: number;
  qty: number;
}

export interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customer: Customer;
  status: OrderStatus;
  date: string;
  total: number;
  items: number;
  address: Address;
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  timeline: TimelineStep[];
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signatureVerified: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrdersApiResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
  message: string;
}
