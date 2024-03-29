import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { disabledFeatures, type featuresEnum } from "../schema";

export type Feature = (typeof featuresEnum)["enumValues"][number];

export async function featureIsDisabled(guildId: string, feature: Feature) {
  return !!(await db.query.disabledFeatures.findFirst({
    where: and(
      eq(disabledFeatures.guildId, guildId),
      eq(disabledFeatures.disabledFeature, feature)
    ),
  }));
}

export async function disableFeature(guildId: string, feature: Feature) {
  return await db
    .insert(disabledFeatures)
    .values({
      guildId,
      disabledFeature: feature,
    })
    .onConflictDoNothing();
}

export async function enableFeature(guildId: string, feature: Feature) {
  return await db
    .delete(disabledFeatures)
    .where(
      and(
        eq(disabledFeatures.guildId, guildId),
        eq(disabledFeatures.disabledFeature, feature)
      )
    );
}
