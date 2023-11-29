import { SlashCommand } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { Embed } from "@/utils/embed.js";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot."),
  run: async ({ client, interaction }) => {
    const res = await interaction.deferReply({
      ephemeral: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply({
      embeds: [
        new Embed()
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
