import type { BotClient } from "@/structures/client";
import { Embed } from "@/utils/embed";
import { db } from "@csmos/db";
import { time } from "discord.js";

export default (client: BotClient<true>) => {
  client.on("messageCreate", async (message) => {
    if (!message.inGuild() || message.author.bot) return;
    const mentioned = message.mentions.members.first();

    if (mentioned) {
      const data = await db.afk.findFirst({
        where: {
          userId: mentioned.id,
        },
      });
      if (!data || new Date().getTime() - data.createdAt.getTime() <= 30 * 1000)
        return;

      return void message.channel.send({
        embeds: [
          new Embed().setDescription(
            `**${mentioned.user.username}** has been AFK since ${time(
              data.createdAt,
              "R"
            )}. ${
              data.reason
                ? `Their reason is **${data.reason}**`
                : "They did not specify a reason."
            }.`
          ),
        ],
      });
    }

    const data = await db.afk.findFirst({
      where: {
        userId: message.author.id,
      },
    });
    if (data) {
      await db.afk.delete({
        where: {
          id: data.id,
        },
      });

      message.channel.send({
        embeds: [
          new Embed().setDescription("Welcome back! I've removed your AFK."),
        ],
      });
    }
  });
};
