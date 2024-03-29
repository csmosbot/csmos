import { Command } from "@/structures/command";
import { SuccessEmbed } from "@/utils/embed";
import { updateGuild } from "@csmos/db";
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
