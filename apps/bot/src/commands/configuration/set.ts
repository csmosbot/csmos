import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { featureIsDisabled, updateGuild } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Update settings for this server.")
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
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "default-volume":
        {
          if (await featureIsDisabled(interaction.guild.id, "music"))
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "The music system is disabled in this server."
                ),
              ],
              ephemeral: true,
            });

          const volume = interaction.options.getNumber("volume", true);

          await updateGuild(interaction.guild.id, {
            defaultVolume: volume,
          });

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
