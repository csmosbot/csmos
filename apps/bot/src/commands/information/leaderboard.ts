import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { calculateLevelXp } from "@/utils/leveling";
import { getUsers } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

const types = {
  xp: "XP",
  messages: "Message",
} as const;

export default new Command({
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 users in this server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("xp")
        .setDescription(
          "View the top 10 users with the most XP in this server."
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("messages")
        .setDescription(
          "View the top 10 users who sent the most messages in this server."
        )
    ),
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL() ?? undefined,
          })
          .setTitle(`${types[subcommand as keyof typeof types]} Leaderboard`)
          .setDescription(
            await Promise.all(
              (await getUsers(interaction.guild.id))
                .sort((a, z) =>
                  subcommand === "xp"
                    ? calculateLevelXp(z.level) +
                      z.xp -
                      (calculateLevelXp(a.level) + a.xp)
                    : z.messages - a.messages
                )
                .map(
                  async (user, index) =>
                    `${index}. **${
                      (await client.users.fetch(user.id.split("-")[1])).username
                    }** (${
                      subcommand === "xp"
                        ? `${user.xp} XP, level ${user.level}`
                        : `${user.messages} messages, ${user.characters} characters`
                    })`
                )
            ).then((arr) => arr.join("\n"))
          ),
      ],
    });
  },
});
