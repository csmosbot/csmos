import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { deleteWarning, featureIsDisabled, getWarning } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("delwarn")
    .setDescription("Delete a warn from a user.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the warning.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "moderation"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The moderation system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const id = interaction.options.getString("id", true);

    if (!(await getWarning(id)))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The warn ID you specified doesn't exist."
          ),
        ],
        ephemeral: true,
      });

    await deleteWarning(id);

    interaction.reply({
      embeds: [new SuccessEmbed().setDescription(`Removed warn **${id}**.`)],
      ephemeral: true,
    });
  },
});
