export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number | string;
  status: "active" | "scheduled" | "draft" | "expired";
  usage: {
    current: number;
    total: number;
  };
  validPeriod: {
    from: string;
    until: string;
  };
  rules?: {
    minOrderAmount?: number;
    maxDiscount?: number;
    firstTimeOnly?: boolean;
    canCombine?: boolean;
  };
  limits?: {
    totalUsage?: number;
    usagePerCustomer?: number;
  };
  activateImmediately?: boolean;
}

export type CouponFormData = Omit<Coupon, "id" | "usage"> & {
  usage?: {
    current: number;
    total: number;
  };
};
