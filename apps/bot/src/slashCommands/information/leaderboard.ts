import { SlashCommand } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { SlashCommandBuilder } from "discord.js";

const types = {
  xp: "XP",
  messages: "Message",
} as const;

export default new SlashCommand({
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
              client.db.users
                .keyArray()
                .filter((key) => key.startsWith(interaction.guild.id))
                .map((key) => ({ id: key, ...client.db.users.get(key) }))
                .sort((a, b) =>
                  subcommand === "xp" ? a.xp - b.xp : a.messages - b.messages
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
