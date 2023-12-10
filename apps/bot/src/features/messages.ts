import type { BotClient } from "@/structures/client";
import { db } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("messageCreate", async (message) => {
    if (!message.inGuild() || message.author.bot) return;

    const characters = message.content.split("").length;
    try {
      await db.user.update({
        where: {
          id: message.author.id,
          guildId: message.guild.id,
        },
        data: {
          messages: {
            increment: 1,
          },
          characters: {
            increment: characters,
          },
        },
      });
    } catch {
      await db.user.update({
        where: {
          id: message.author.id,
          guildId: message.guild.id,
        },
        data: {
          messages: {
            increment: 1,
          },
          characters: {
            increment: characters,
          },
        },
      });
    }
  });
};
