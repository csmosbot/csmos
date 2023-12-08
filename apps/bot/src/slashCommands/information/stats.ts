import { SlashCommand } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { db } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View a user's statistics.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to view the statistics of.")
        .setRequired(false)
    ),
  run: async ({ client, interaction }) => {
    const member = interaction.options.getMember("user") ?? interaction.member;

    const data = await db.user.upsert({
      where: {
        id: member.id,
        guildId: interaction.guild.id,
      },
      create: {
        id: member.id,
        guildId: interaction.guild.id,
      },
      update: {},
    });
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
                `You can also view these statistics by running \`${await getPrefix(
                  client,
                  interaction.guild.id
                )}rank\`.`,
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
