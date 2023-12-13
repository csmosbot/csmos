import type { BotClient } from "@/structures/client";
import { config } from "@/utils/config";
import { calculateLevelXp } from "@/utils/leveling";
import { getUser, updateUser } from "@csmos/db";
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

    const user = await getUser(message.author.id, message.guild.id);
    let xp = user.xp;

    const xpToGive = random(5, 15);
    xp += xpToGive;

    await updateUser(message.author.id, message.guild.id, {
      xp,
    });

    xpCooldowns.add(`${message.guild.id}-${message.author.id}`);
    setTimeout(
      () => xpCooldowns.delete(`${message.guild.id}-${message.author.id}`),
      30_000
    );

    if (xp > calculateLevelXp(user.level || 0)) {
      await updateUser(message.author.id, message.guild.id, {
        xp: 0,
        level: user.level + 1,
      });

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Congratulations!")
            .setDescription(
              `You've just leveled up to level **${(
                (user.level || 0) + 1
              ).toLocaleString()}**!`
            )
            .setColor(config.colors.primary),
        ],
      });
    }
  });
};
