import { PrismaClient } from ".prisma/auth-client";

declare global {
  // eslint-disable-next-line no-var
  var authPrisma: PrismaClient | undefined;
}

export const prisma = global.authPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.authPrisma = prisma;
}
