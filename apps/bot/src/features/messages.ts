import type { BotClient } from "@/structures/client";
import { db } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("messageCreate", async (message) => {
    if (!message.inGuild() || message.author.bot) return;

    if (
      !(await db.user.findFirst({
        where: { id: message.author.id, guildId: message.guild.id },
      }))
    )
      await db.user.create({
        data: {
          id: message.author.id,
          guildId: message.guild.id,
        },
      });

    const characters = message.content.split("").length;
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
  });
};
