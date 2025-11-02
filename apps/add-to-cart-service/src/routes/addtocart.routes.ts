import express from "express";
import {
  addToCart,

  removeFromCart,
  increaseQuantity,
  
  decreaseQuantity,
  getCart

} from "../controller/addtocart.controller";

import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router = express.Router();

router.use(isAuthenticated); // ensures req.user.id is available

router.post("/add-to-cart", addToCart);
router.delete("/remove-to-cart", removeFromCart);
router.patch("/increase-to-cart", increaseQuantity);
router.patch("/decrease-to-cart", decreaseQuantity);
router.get("/get-all-cart", getCart);

export default router;
