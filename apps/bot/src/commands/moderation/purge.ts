import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms from "ms";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages from this channel at once.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to delete.")
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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

    const amount = interaction.options.getNumber("amount", true);

    const messages = await interaction.channel.messages.fetch({
      limit: amount + 1,
    });
    const filtered = messages.filter(
      (msg) => Date.now() - msg.createdTimestamp < ms("14 days") && !msg.pinned
    );

    await interaction.channel.bulkDelete(filtered);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Deleted ${amount.toLocaleString()} messages.`
        ),
      ],
    });
  },
});
