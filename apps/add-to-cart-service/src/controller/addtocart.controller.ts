import { NextFunction, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  AuthError,
  ValidationError,
  NotFoundError,
} from "../../../../packages/error-handler/index";
import axios from "axios";

export const addToCart = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id;

    // Authentication check
    if (!userId) {
      throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
    }

    // Input validation
    if (!productId) {
      throw new ValidationError("Product ID is required", {
        field: "productId",
        received: productId,
      });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new ValidationError("Quantity must be a positive integer", {
        field: "quantity",
        received: quantity,
        expected: "positive integer",
      });
    }

    // Verify product exists via Product Service API
    try {
      const productResponse = await axios.get(
        `http://localhost:6002/api/${productId}`
      );

      const product = productResponse.data;

      // Check if product is in stock
      if (product.stockQuantity < quantity) {
        throw new ValidationError("Insufficient stock available", {
          requested: quantity,
          available: product.stockQuantity,
          productId,
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Product not found", {
          productId,
          resource: "product",
        });
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to verify product: ${error.message}`);
    }

    // Add/update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });

    // Success response
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cartItem: {
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          addedAt: cartItem.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    // Authentication check
    if (!userId) {
      throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
    }

    // Input validation
    if (!productId) {
      throw new ValidationError("Product ID is required", {
        field: "productId",
        received: productId,
      });
    }

    // Check if cart item exists before attempting to delete
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!existingCartItem) {
      throw new NotFoundError("Cart item not found", {
        productId,
        userId,
        resource: "cartItem",
      });
    }

    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const increaseQuantity = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    // Authentication check
    if (!userId) {
      throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
    }

    // Input validation
    if (!productId) {
      throw new ValidationError("Product ID is required", {
        field: "productId",
        received: productId,
      });
    }

    // Check if cart item exists
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!existingCartItem) {
      throw new NotFoundError("Cart item not found", {
        productId,
        userId,
        resource: "cartItem",
      });
    }

    // Check product stock before increasing quantity via Product Service
    try {
      const productResponse = await axios.get(
        `http://localhost:6002/api/${productId}`
      );

      const product = productResponse.data;

      if (product.stockQuantity <= existingCartItem.quantity) {
        throw new ValidationError(
          "Cannot increase quantity - insufficient stock",
          {
            currentQuantity: existingCartItem.quantity,
            maxAvailable: product.stockQuantity,
            productId,
          }
        );
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Product not found", {
          productId,
          resource: "product",
        });
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to verify product stock: ${error.message}`);
    }

    const updated = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: { increment: 1 } },
    });

    res.status(200).json({
      success: true,
      message: "Quantity increased successfully",
      data: {
        cartItem: updated,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const decreaseQuantity = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    // Authentication check
    if (!userId) {
      throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
    }

    // Input validation
    if (!productId) {
      throw new ValidationError("Product ID is required", {
        field: "productId",
        received: productId,
      });
    }

    // Check if cart item exists
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!existing) {
      throw new NotFoundError("Cart item not found", {
        productId,
        userId,
        resource: "cartItem",
      });
    }

    // If quantity is 1 or less, remove the item completely
    if (existing.quantity <= 1) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: {
          removed: true,
        },
      });
      return;
    }

    // Decrease quantity by 1
    const updated = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: { decrement: 1 } },
    });

    res.status(200).json({
      success: true,
      message: "Quantity decreased successfully",
      data: {
        cartItem: updated,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Authentication check
    if (!userId) {
      throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch product details for each cart item from Product Service
    const cartItemsWithProducts = await Promise.all(
      cartItems.map(async (item: any) => {
        try {
          const productResponse = await axios.get(
            `http://localhost:6002/api/${item.productId}`
          );
          return {
            ...item,
            product: productResponse.data,
          };
        } catch (error) {
          // If product not found, return cart item with null product
          return {
            ...item,
            product: null,
          };
        }
      })
    );

    // Calculate cart summary
    const totalItems = cartItemsWithProducts.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const totalAmount = cartItemsWithProducts.reduce(
      (sum: number, item: any) =>
        sum + (item.product ? item.quantity * item.product.regularPrice : 0),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        cartItems: cartItemsWithProducts,
        summary: {
          totalItems,
          totalAmount,
          itemCount: cartItemsWithProducts.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
