import { Coupon } from "../types/coupon";

export const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "SAVE20",
    name: "20% Off Summer Sale",
    description: "Summer sale discount for all products",
    type: "percentage",
    value: 20,
    status: "active",
    usage: {
      current: 145,
      total: 1000,
    },
    validPeriod: {
      from: "2024-01-01",
      until: "2024-12-31",
    },
    rules: {
      minOrderAmount: 0,
      maxDiscount: undefined,
      firstTimeOnly: false,
      canCombine: false,
    },
  },
  {
    id: "2",
    code: "NEWUSER50",
    name: "New User Discount",
    description: "First time user discount",
    type: "fixed",
    value: 50,
    status: "active",
    usage: {
      current: 89,
      total: 500,
    },
    validPeriod: {
      from: "2024-01-01",
      until: "2024-12-31",
    },
    rules: {
      minOrderAmount: 0,
      maxDiscount: 50,
      firstTimeOnly: true,
      canCombine: false,
    },
  },
  {
    id: "3",
    code: "FREESHIP",
    name: "Free Shipping Promo",
    description: "Free shipping on all orders",
    type: "free_shipping",
    value: "Free Shipping",
    status: "scheduled",
    usage: {
      current: 0,
      total: 0,
    },
    validPeriod: {
      from: "2024-12-01",
      until: "2024-12-31",
    },
    rules: {
      minOrderAmount: 0,
      maxDiscount: undefined,
      firstTimeOnly: false,
      canCombine: true,
    },
  },
  {
    id: "4",
    code: "BLACKFRIDAY",
    name: "Black Friday Sale",
    description: "Black Friday special discount",
    type: "percentage",
    value: 40,
    status: "draft",
    usage: {
      current: 0,
      total: 0,
    },
    validPeriod: {
      from: "2024-11-29",
      until: "2024-11-29",
    },
    rules: {
      minOrderAmount: 100,
      maxDiscount: 200,
      firstTimeOnly: false,
      canCombine: false,
    },
  },
];
