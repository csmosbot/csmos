import { SlashCommand } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { SuccessEmbed } from "@/utils/embed.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Update settings for this server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("prefix")
        .setDescription("Update the prefix for this server.")
        .addStringOption((option) =>
          option
            .setName("prefix")
            .setDescription("The new prefix for this server.")
            .setMaxLength(5)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("default-volume")
        .setDescription("Update the default volume for this server.")
        .addNumberOption((option) =>
          option
            .setName("percentage")
            .setDescription(
              "The new default volume percentage for this server."
            )
            .setMinValue(0)
            .setMaxValue(150)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "prefix":
        {
          const prefix = interaction.options.getString("prefix", true);

          client.db.guilds.set(interaction.guild.id, prefix, "prefix");

          interaction.reply({
            embeds: [
              new SuccessEmbed()
                .setDescription(
                  `My prefix in this server is now \`${prefix}\`!`
                )
                .setColor(config.colors.success),
            ],
            ephemeral: true,
          });
        }
        break;
      case "default-volume":
        {
          const volume = interaction.options.getNumber("volume", true);

          client.db.guilds.set(interaction.guild.id, volume, "defaultVolume");

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                `Updated default volume to **${volume}%**.`
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
});
