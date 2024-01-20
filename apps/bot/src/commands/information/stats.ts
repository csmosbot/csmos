import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { getUser } from "@csmos/db";
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
              value: [
                "You can also view these statistics by running `/rank`.",
                `• **XP**: ${data.xp}`,
                `• **Level**: ${data.level}`,
              ].join("\n"),
            },
            {
              name: "Messages",
              value: [
                `• **Messages**: ${data.messages}`,
                `• **Characters**: ${data.characters}`,
              ].join("\n"),
            }
          ),
      ],
    });
  },
});
