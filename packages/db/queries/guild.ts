import { eq } from "drizzle-orm";
import { db } from "../db";
import { guilds } from "../schema";

export async function getGuild(guildId: string) {
  const guild = await db.query.guilds.findFirst({
    where: eq(guilds.id, guildId),
  });
  if (guild) return guild;

  try {
    return (
      await db
        .insert(guilds)
        .values({
          id: guildId,
        })
        .returning()
    )[0];
  } catch {
    return getGuild(guildId);
  }
}

export async function createGuild(guildId: string) {
  await db
    .insert(guilds)
    .values({
      id: guildId,
    })
    .onConflictDoNothing();
}

export async function updateGuild(
  guildId: string,
  data: Omit<typeof guilds.$inferInsert, "id">
) {
  await db.update(guilds).set(data).where(eq(guilds.id, guildId));
}
