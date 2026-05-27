import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaSingleton: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (process.env["NODE_ENV"] !== "production") {
    if (!globalThis.prisma) {
      globalThis.prisma = createPrismaClient();
    }
    return globalThis.prisma;
  }
  if (!prismaSingleton) {
    prismaSingleton = createPrismaClient();
  }
  return prismaSingleton;
}

/** Lazy Prisma client — avoids connecting at import time during `next build`. */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
