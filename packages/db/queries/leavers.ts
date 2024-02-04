import { eq } from "drizzle-orm";
import { db } from "../db";
import { leavers } from "../schema";

export const getLeaver = (guildId: string) =>
  db.query.leavers.findFirst({
    where: eq(leavers.guildId, guildId),
  });

export async function createLeaver(data: typeof leavers.$inferInsert) {
  await db.insert(leavers).values(data);
}

export async function updateLeaver(
  guildId: string,
  data: Partial<Omit<typeof leavers.$inferInsert, "id" | "guildId">>
) {
  await db.update(leavers).set(data).where(eq(leavers.guildId, guildId));
}

export async function deleteLeaver(leaverId: string) {
  await db.delete(leavers).where(eq(leavers.id, leaverId));
}
