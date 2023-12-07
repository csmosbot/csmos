import { SlashCommand } from "@/structures/command.js";
import { DangerEmbed, Embed } from "@/utils/embed.js";
import { SlashCommandBuilder, time } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View all warnings of a user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to view the warnings of.")
    ),
  run: ({ client, interaction }) => {
    const member = interaction.options.getMember("user") || interaction.member;
    if (
      member.id !== interaction.member.id &&
      !interaction.member.permissions.has("ModerateMembers")
    )
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "You do not have permission to view other users' warnings."
          ),
        ],
        ephemeral: true,
      });

    client.db.users.ensure(`${interaction.guild.id}-${member.id}`, {
      warnings: [],
    });

    const warnings = client.db.users.get(
      `${interaction.guild.id}-${member.id}`,
      "warnings"
    );

    if (!warnings.length)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `${
              member.id === interaction.member.id
                ? "You don't"
                : `**${member.user.username}** doesn't`
            } have any warnings yet.`
          ),
        ],
      });

    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .setTitle("Warnings")
          .addFields(
            warnings.map((warning) => ({
              name: warning.id,
              value: [
                `**Moderator**: <@${warning.moderatorId}> (${warning.moderatorId})`,
                `**Reason**: ${warning.reason}`,
                `**Warned**: ${time(new Date(warning.createdAt), "R")}`,
              ].join("\n"),
            }))
          ),
      ],
    });
  },
});
