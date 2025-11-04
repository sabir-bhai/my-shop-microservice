import { Router } from "express";
import {
  addReviewToProduct,
  getReviewsByProduct,
} from "../controllers/review.controller";

const router = Router();

router.post("/:id/reviews", addReviewToProduct);
router.get("/:id/reviews", getReviewsByProduct);

export default router;
