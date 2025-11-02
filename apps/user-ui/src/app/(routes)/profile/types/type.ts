export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface Order {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  total: number;
  items: number;
}

export interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "resolved";
  date: string;
}
