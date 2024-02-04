import { eq } from "drizzle-orm";
import { db } from "../db";
import { welcomers } from "../schema";

export const getWelcomer = (guildId: string) =>
  db.query.welcomers.findFirst({
    where: eq(welcomers.guildId, guildId),
  });

export async function createWelcomer(data: typeof welcomers.$inferInsert) {
  await db.insert(welcomers).values(data);
}

export async function updateWelcomer(
  guildId: string,
  data: Partial<Omit<typeof welcomers.$inferInsert, "id" | "guildId">>
) {
  await db.update(welcomers).set(data).where(eq(welcomers.guildId, guildId));
}

export async function deleteWelcomer(welcomerId: string) {
  await db.delete(welcomers).where(eq(welcomers.id, welcomerId));
}
