import { PrismaClient as ReviewPrismaClient } from "../../../../node_modules/.prisma/review-client";

declare global {
  namespace globalThis {
    var reviewPrisma: ReviewPrismaClient;
  }
}

export const prisma =
  globalThis.reviewPrisma ||
  new ReviewPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.reviewPrisma = prisma;
}
