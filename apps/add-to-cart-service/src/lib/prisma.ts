import { PrismaClient as CartPrismaClient } from "../../../../node_modules/.prisma/cart-client";

declare global {
  namespace globalThis {
    var cartPrisma: CartPrismaClient;
  }
}

export const prisma =
  globalThis.cartPrisma ||
  new CartPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.cartPrisma = prisma;
}
