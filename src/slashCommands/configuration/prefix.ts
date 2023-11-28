import { SlashCommand } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Update the prefix for this server.")
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("The new prefix for this server.")
        .setRequired(true)
    ),
  run: ({ client, interaction }) => {
    const prefix = interaction.options.getString("prefix", true);
    if (prefix.length > 5)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Prefix must be less than 5 characters.")
            .setColor(config.colors.danger),
        ],
        ephemeral: true,
      });

    client.db.guilds.set(interaction.guild.id, prefix, "prefix");

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`My prefix in this server is now \`${prefix}\`!`)
          .setColor(config.colors.success),
      ],
      ephemeral: true,
    });
  },
});
