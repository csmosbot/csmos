import { SlashCommand } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { db } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
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
    const id = interaction.options.getString("id", true);

    if (
      !(await db.warning.findFirst({
        where: {
          id,
        },
      }))
    )
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The warn ID you specified doesn't exist."
          ),
        ],
        ephemeral: true,
      });

    await db.warning.delete({
      where: {
        id,
      },
    });

    interaction.reply({
      embeds: [new SuccessEmbed().setDescription(`Removed warn **${id}**.`)],
      ephemeral: true,
    });
  },
});
