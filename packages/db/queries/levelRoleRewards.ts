import { eq } from "drizzle-orm";
import { db } from "../db";
import { levelRoleRewards } from "../schema";

export async function getLevelRoleRewards(guildId: string) {
  return await db.query.levelRoleRewards.findMany({
    where: eq(levelRoleRewards.guildId, guildId),
  });
}

export async function getLevelRoleRewardsByLevel(level: number) {
  return await db.query.levelRoleRewards.findMany({
    where: eq(levelRoleRewards.level, level),
  });
}

export async function getLevelRoleRewardByRoleId(roleId: string) {
  return await db.query.levelRoleRewards.findFirst({
    where: eq(levelRoleRewards.roleId, roleId),
  });
}

export async function createLevelRoleReward(
  data: typeof levelRoleRewards.$inferInsert
) {
  return await db.insert(levelRoleRewards).values(data);
}

export async function deleteLevelRoleReward(id: string) {
  return await db.delete(levelRoleRewards).where(eq(levelRoleRewards.id, id));
}
