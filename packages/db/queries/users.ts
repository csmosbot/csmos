import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";

export async function getUser(userId: string, guildId: string) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.guildId, guildId)),
  });
  console.log(user);
  if (user) return user;

  try {
    return (
      await db
        .insert(users)
        .values({
          id: userId,
          guildId,
        })
        .returning()
    )[0];
  } catch {
    return getUser(userId, guildId);
  }
}

export const getUsers = (guildId: string) =>
  db.query.users.findMany({
    where: eq(users.guildId, guildId),
  });

export async function updateUser(
  userId: string,
  guildId: string,
  data: Omit<typeof users.$inferInsert, "id" | "guildId">
) {
  await db
    .update(users)
    .set(data)
    .where(and(eq(users.id, userId), eq(users.guildId, guildId)));
}
