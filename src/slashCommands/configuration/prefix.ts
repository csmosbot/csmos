import { SlashCommand } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { SuccessEmbed } from "@/utils/embed.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Update the prefix for this server.")
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("The new prefix for this server.")
        .setMaxLength(5)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: ({ client, interaction }) => {
    const prefix = interaction.options.getString("prefix", true);

    client.db.guilds.set(interaction.guild.id, prefix, "prefix");

    interaction.reply({
      embeds: [
        new SuccessEmbed()
          .setDescription(`My prefix in this server is now \`${prefix}\`!`)
          .setColor(config.colors.success),
      ],
      ephemeral: true,
    });
  },
});
