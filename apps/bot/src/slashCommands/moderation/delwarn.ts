import { SlashCommand } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";
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
  run: ({ client, interaction }) => {
    const id = interaction.options.getString("id", true);

    const key = client.db.users.findKey(
      (user) => !!user?.warnings?.find((warning) => warning.id === id)
    );
    if (!key)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The warn ID you specified doesn't exist."
          ),
        ],
        ephemeral: true,
      });

    const user = client.db.users.get(key);
    const newWarnings = user.warnings.filter((warning) => warning.id !== id);
    client.db.users.set(key, newWarnings, "warnings");

    interaction.reply({
      embeds: [new SuccessEmbed().setDescription(`Removed warn **${id}**.`)],
      ephemeral: true,
    });
  },
});
