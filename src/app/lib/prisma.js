import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis; // len 1x deklarované

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["query"], // Voliteľné - zobrazí SQL dotazy v konzole
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;