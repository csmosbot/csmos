import type { BotClient } from "@/structures/client.js";
import { config } from "./config.js";

export const getPrefix = (client: BotClient<true>, guildId: string) =>
  client.db.guilds.get(guildId, "prefix") ?? config.prefix;
