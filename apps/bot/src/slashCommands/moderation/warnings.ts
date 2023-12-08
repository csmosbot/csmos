import { SlashCommand } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { db } from "@csmos/db";
import { SlashCommandBuilder, time } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View all warnings of a user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to view the warnings of.")
    ),
  run: async ({ interaction }) => {
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

    const { warnings } = await db.user.upsert({
      where: {
        id: interaction.user.id,
        guildId: interaction.guild.id,
      },
      create: {
        id: interaction.user.id,
        guildId: interaction.guild.id,
      },
      update: {},
      include: {
        warnings: true,
      },
    });

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
