import type { BotClient } from "@/structures/client.js";
import { config } from "@/utils/config.js";
import { calculateLevelXp } from "@/utils/leveling.js";
import { EmbedBuilder } from "discord.js";

const xpCooldowns = new Set<string>();
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;

export default (client: BotClient<true>) => {
  client.on("messageCreate", (message) => {
    if (
      !message.inGuild() ||
      message.author.bot ||
      xpCooldowns.has(message.author.id)
    )
      return;

    client.db.users.ensure(message.author.id, {
      xp: 0,
      level: 0,
      warnings: [],
    });

    const xpToGive = random(5, 15);
    client.db.users.math(message.author.id, "+", xpToGive, "xp");

    xpCooldowns.add(message.author.id);
    setTimeout(() => xpCooldowns.delete(message.author.id), 30_000);

    const user = client.db.users.get(message.author.id);
    if (user.xp > calculateLevelXp(user.level)) {
      client.db.users.set(message.author.id, 0, "xp");
      client.db.users.math(message.author.id, "+", 1, "level");

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Congratulations!")
            .setDescription(
              `You've just leveled up to level **${client.db.users
                .get(message.author.id, "level")
                .toLocaleString()}**!`
            )
            .setColor(config.colors.primary),
        ],
      });
    }
  });
};
