import { SlashCommand } from "@/structures/command.js";
import { Embed } from "@/utils/embed.js";
import { getPrefix } from "@/utils/prefix.js";
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
  run: ({ client, interaction }) => {
    const member = interaction.options.getMember("user") ?? interaction.member;

    client.db.users.ensure(`${interaction.guild.id}-${member.id}`, {
      xp: 0,
      level: 0,
      messages: 0,
      characters: 0,
    });

    const data = client.db.users.get(`${interaction.guild.id}-${member.id}`);
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
                `You can also view these statistics by running \`${getPrefix(
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
