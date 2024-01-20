import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { Embed } from "@/utils/embed";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
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
