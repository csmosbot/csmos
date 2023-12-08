import type { BotClient } from "@/structures/client";
import { config } from "./config";

export const getPrefix = (client: BotClient<true>, guildId: string) =>
  client.db.guilds.get(guildId, "prefix") ?? config.prefix;
