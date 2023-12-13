import { getGuild } from "@csmos/db";
import { config } from "./config";

export const getPrefix = async (guildId: string) =>
  (await getGuild(guildId))?.prefix ?? config.prefix;
