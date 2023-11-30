import { SlashCommand } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms from "ms";

export default new SlashCommand({
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
