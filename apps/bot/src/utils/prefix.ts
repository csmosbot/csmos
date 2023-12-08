import type { BotClient } from "@/structures/client";
import { db } from "@csmos/db";
import { config } from "./config";

export const getPrefix = async (client: BotClient<true>, guildId: string) =>
  (await db.guild.findFirst({ where: { id: guildId } }))?.prefix ??
  config.prefix;
