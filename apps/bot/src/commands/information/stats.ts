import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { getUser, featureIsDisabled } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View a user's statistics.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to view the statistics of.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const levelingDisabled = await featureIsDisabled(
      interaction.guild.id,
      "leveling"
    );
    const messageTrackingDisabled = await featureIsDisabled(
      interaction.guild.id,
      "message_tracking"
    );
    if (levelingDisabled && messageTrackingDisabled)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The leveling and message tracking system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const member = interaction.options.getMember("user") ?? interaction.member;

    const data = await getUser(member.id, interaction.guild.id);
    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .addFields(
            {
              name: "Leveling",
              value: levelingDisabled
                ? "The leveling system is disabled in this server."
                : [
                    "You can also view these statistics by running `/rank`.",
                    `• **XP**: ${data.xp}`,
                    `• **Level**: ${data.level}`,
                  ].join("\n"),
            },
            {
              name: "Messages",
              value: messageTrackingDisabled
                ? "The message tracking system is disabled in this server."
                : [
                    `• **Messages**: ${data.messages}`,
                    `• **Characters**: ${data.characters}`,
                  ].join("\n"),
            }
          ),
      ],
    });
  },
});
