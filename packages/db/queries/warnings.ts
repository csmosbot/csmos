import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { warnings } from "../schema";

export const getWarning = (warnId: string) =>
  db.query.warnings.findFirst({
    where: eq(warnings.id, warnId),
  });

export const getWarnings = (userId: string, guildId: string) =>
  db.query.warnings.findMany({
    where: and(eq(warnings.userId, userId), eq(warnings.guildId, guildId)),
  });

export async function createWarning(data: typeof warnings.$inferInsert) {
  await db.insert(warnings).values(data);
}

export async function deleteWarning(warnId: string) {
  await db.delete(warnings).where(eq(warnings.id, warnId));
}
