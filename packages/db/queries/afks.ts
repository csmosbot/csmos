import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { afks } from "../schema";

export const getAfk = (userId: string, guildId: string) =>
  db.query.afks.findFirst({
    where: and(eq(afks.userId, userId), eq(afks.guildId, guildId)),
  });

export async function createAfk(data: typeof afks.$inferInsert) {
  await db.insert(afks).values(data);
}

export async function deleteAfk(afkId: string) {
  await db.delete(afks).where(eq(afks.id, afkId));
}
