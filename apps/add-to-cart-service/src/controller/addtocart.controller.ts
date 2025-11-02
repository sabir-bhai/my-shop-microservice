// import { NextFunction, Request, Response } from "express";
// import { prisma } from "../../../../packages/libs/prisma/index";
// import {
//   AuthError,
//   ValidationError,
//   NotFoundError,
// } from "../../../../packages/error-handler/index";

// export const addToCart = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   debugger;
//   try {
//     const { productId, quantity = 1 } = req.body;
//     const userId = req.user?.id;

//     // Authentication check
//     if (!userId) {
//       throw new AuthError("Authentication required", "AUTHENTICATION_REQUIRED");
//     }

//     // Input validation
//     if (!productId) {
//       throw new ValidationError("Product ID is required", {
//         field: "productId",
//         received: productId,
//       });
//     }

//     if (quantity <= 0 || !Number.isInteger(quantity)) {
//       throw new ValidationError("Quantity must be a positive integer", {
//         field: "quantity",
//         received: quantity,
//         expected: "positive integer",
//       });
//     }

//     // Check if product exists
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       throw new NotFoundError("Product not found", {
//         productId,
//         resource: "product",
//       });
//     }

//     // Optional: Check if product is in stock
//     if (product.stockQuantity < quantity) {
//       throw new ValidationError("Insufficient stock available", {
//         requested: quantity,
//         available: product.stockQuantity,
//         productId,
//       });
//     }

//     // Add/update cart item
//     const cartItem = await prisma.cartItem.upsert({
//       where: {
//         userId_productId: { userId, productId },
//       },
//       update: {
//         quantity: { increment: quantity },
//       },
//       create: {
//         userId,
//         productId,
//         quantity,
//       },
//       include: {
//         product: {
//           select: {
//             id: true,
//             title: true,
//             regularPrice: true,
//             images: true,
//           },
//         },
//       },
//     });

//     // Success response
//     res.status(200).json({
//       success: true,
//       message: "Product added to cart successfully",
//       data: {
//         cartItem: {
//           id: cartItem.id,
//           quantity: cartItem.quantity,
//           product: cartItem.product,
//           addedAt: cartItem.createdAt,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// export const removeFromCart = async (req: any, res: Response) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user?.id;

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     await prisma.cartItem.delete({
//       where: { userId_productId: { userId, productId } },
//     });

//     res.status(200).json({ message: "Removed from cart" });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const increaseQuantity = async (req: any, res: Response) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user?.id;

//     const updated = await prisma.cartItem.update({
//       where: { userId_productId: { userId, productId } },
//       data: { quantity: { increment: 1 } },
//     });

//     res.status(200).json(updated);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const decreaseQuantity = async (req: any, res: Response) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user?.id;

//     const existing = await prisma.cartItem.findUnique({
//       where: { userId_productId: { userId, productId } },
//     });

//     if (!existing || existing.quantity <= 1) {
//       await prisma.cartItem.delete({
//         where: { userId_productId: { userId, productId } },
//       });
//       return res.status(200).json({ message: "Item removed from cart" });
//     }

//     const updated = await prisma.cartItem.update({
//       where: { userId_productId: { userId, productId } },
//       data: { quantity: { decrement: 1 } },
//     });

//     res.status(200).json(updated);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getCart = async (req: any, res: Response) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const cartItems = await prisma.cartItem.findMany({
//       where: { userId },
//       include: {
//         product: {
//           include: {
//             images: true,
//           },
//         },
//       },
//     });

//     res.status(200).json(cartItems);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../packages/libs/prisma/index";
import {
  AuthError,
  ValidationError,
  NotFoundError,
} from "../../../../packages/error-handler/index";

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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found", {
        productId,
        resource: "product",
      });
    }

    // Optional: Check if product is in stock
    if (product.stockQuantity < quantity) {
      throw new ValidationError("Insufficient stock available", {
        requested: quantity,
        available: product.stockQuantity,
        productId,
      });
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
      include: {
        product: {
          select: {
            id: true,
            title: true,
            regularPrice: true,
            images: true,
          },
        },
      },
    });

    // Success response
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cartItem: {
          id: cartItem.id,
          quantity: cartItem.quantity,
          product: cartItem.product,
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

    // Check product stock before increasing quantity
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found", {
        productId,
        resource: "product",
      });
    }

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

    const updated = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: { increment: 1 } },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            regularPrice: true,
            images: true,
          },
        },
      },
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
      include: {
        product: {
          select: {
            id: true,
            title: true,
            regularPrice: true,
            images: true,
          },
        },
      },
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
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate cart summary
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.regularPrice,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        cartItems,
        summary: {
          totalItems,
          totalAmount,
          itemCount: cartItems.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
