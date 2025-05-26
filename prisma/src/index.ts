import { PrismaClient } from "../lib/generated/prisma";

const db = new PrismaClient();

export { db, PrismaClient };
