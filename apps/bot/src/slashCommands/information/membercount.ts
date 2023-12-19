import { SlashCommand } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("View the amount of members in a server."),
  run: async ({ interaction }) => {
    const members = interaction.guild.memberCount;
    const users = interaction.guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    const bots = interaction.guild.members.cache.filter(
      (member) => member.user.bot
    ).size;

    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL() ?? undefined,
          })
          .addFields(
            {
              name: "Members",
              value: members.toLocaleString(),
              inline: true,
            },
            {
              name: "Users",
              value: users.toLocaleString(),
              inline: true,
            },
            {
              name: "Bots",
              value: bots.toLocaleString(),
              inline: true,
            }
          ),
      ],
    });
  },
});
