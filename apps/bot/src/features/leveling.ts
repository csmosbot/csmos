import type { BotClient } from "@/structures/client";
import { config } from "@/utils/config";
import { calculateLevelXp } from "@/utils/leveling";
import { db } from "@csmos/db";
import { EmbedBuilder } from "discord.js";

const xpCooldowns = new Set<string>();
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;

export default (client: BotClient<true>) => {
  client.on("messageCreate", async (message) => {
    if (
      !message.inGuild() ||
      message.author.bot ||
      xpCooldowns.has(`${message.guild.id}-${message.author.id}`)
    )
      return;

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

    const xpToGive = random(5, 15);

    await db.user.update({
      where: { id: message.author.id, guildId: message.guild.id },
      data: {
        xp: {
          increment: xpToGive,
        },
      },
    });

    xpCooldowns.add(`${message.guild.id}-${message.author.id}`);
    setTimeout(
      () => xpCooldowns.delete(`${message.guild.id}-${message.author.id}`),
      30_000
    );

    const user = await db.user.upsert({
      where: {
        id: message.author.id,
        guildId: message.guild.id,
      },
      create: {
        id: message.author.id,
        guildId: message.guild.id,
      },
      update: {},
    });
    if (user.xp > calculateLevelXp(user.level)) {
      await db.user.update({
        where: {
          id: message.author.id,
          guildId: message.guild.id,
        },
        data: {
          xp: 0,
          level: {
            increment: 1,
          },
        },
      });

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Congratulations!")
            .setDescription(
              `You've just leveled up to level **${(
                user.level + 1
              ).toLocaleString()}**!`
            )
            .setColor(config.colors.primary),
        ],
      });
    }
  });
};
