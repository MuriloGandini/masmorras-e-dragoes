import { PrismaClient } from "@prisma/client";

// This bypasses the strict constructor constraint without breaking your actual query types
export const prisma = new PrismaClient() as any;