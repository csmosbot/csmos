import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { reactionRoles } from "../schema";

export async function getReactionRole(id: string) {
  return await db.query.reactionRoles.findFirst({
    where: eq(reactionRoles.id, id),
  });
}

export async function getReactionRoleByEmojiAndMessageId(
  emoji: string,
  messageId: string
) {
  return await db.query.reactionRoles.findFirst({
    where: and(
      eq(reactionRoles.emoji, emoji),
      eq(reactionRoles.messageId, messageId)
    ),
  });
}

export async function createReactionRole(
  data: typeof reactionRoles.$inferInsert
) {
  return await db.insert(reactionRoles).values(data);
}

export async function updateReactionRole(
  id: string,
  data: Partial<typeof reactionRoles.$inferInsert>
) {
  return await db
    .update(reactionRoles)
    .set(data)
    .where(eq(reactionRoles.id, id));
}

export async function deleteReactionRole(id: string) {
  return await db.delete(reactionRoles).where(eq(reactionRoles.id, id));
}
