import { PrismaClient } from "@prisma/client/extension";

export { PrismaClient };
export const db = new PrismaClient();
