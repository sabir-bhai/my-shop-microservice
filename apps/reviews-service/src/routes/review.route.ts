import { Router } from "express";
import {
  addReviewToProduct,
  getReviewsByProduct,
} from "../controllers/review.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router = Router();

router.post("/products/:productId/reviews", isAuthenticated, addReviewToProduct);
router.get("/products/:productId/reviews", getReviewsByProduct);

export default router;
