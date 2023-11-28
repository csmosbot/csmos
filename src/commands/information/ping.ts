import { Command } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { EmbedBuilder } from "discord.js";

export default new Command({
  name: "ping",
  description: "Pings the bot.",
  run: async ({ client, message }) => {
    const res = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("Pinging...")
          .setColor(config.colors.primary),
      ],
    });

    const ping = res.createdTimestamp - message.createdTimestamp;

    res.edit({
      embeds: [
        new EmbedBuilder()
          .setTitle("Pong! 🏓")
          .setFields(
            {
              name: "🤖 Bot",
              value: `${ping.toLocaleString()}ms`,
              inline: true,
            },
            {
              name: "📶 API",
              value: `${client.ws.ping.toLocaleString()}ms`,
              inline: true,
            }
          )
          .setColor(config.colors.primary),
      ],
    });
  },
});
