import express, { Router } from "express";
import {
  captureRazorpayPayment,
  createRazorpayOrder,
  getAllOrders,
  verifyRazorpayPayment,
} from "../controllers/order.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = express.Router();

// Public routes (no authentication required)
router.get("/get-all-orders", getAllOrders);

// Apply authentication middleware to all routes below this line

// Protected routes (authentication required)
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/capture", captureRazorpayPayment);

export default router;
