import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { calculateLevelXp } from "@/utils/leveling";
import { db } from "@csmos/db";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type MessageReplyOptions,
} from "discord.js";

const types = {
  xp: "XP",
  messages: "Message",
} as const;

export default new Command({
  name: "leaderboard",
  description: "View the top 10 users in this server.",
  aliases: ["lb"],
  usage: "leaderboard <xp | messages>",
  run: async ({ client, message, args }) => {
    let subcommand = args[0] ?? "xp";
    if (!["xp", "messages"].includes(subcommand))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Invalid subcommand specified. Subcommand can be either `xp` or `messages`."
          ),
        ],
      });

    const generateEmbed = async (subcommand: string) => [
      new Embed()
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL() ?? undefined,
        })
        .setTitle(`${types[subcommand as keyof typeof types]} Leaderboard`)
        .setDescription(
          await Promise.all(
            (
              await db.user.findMany({
                where: {
                  id: message.guild.id,
                },
              })
            )
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
    ];

    const generateButtons = (subcommand: string) => [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("XP")
          .setCustomId("xp-leaderboard")
          .setStyle(
            subcommand === "xp" ? ButtonStyle.Primary : ButtonStyle.Secondary
          )
          .setDisabled(subcommand === "xp"),
        new ButtonBuilder()
          .setLabel("Messages")
          .setCustomId("messages-leaderboard")
          .setStyle(
            subcommand === "messages"
              ? ButtonStyle.Primary
              : ButtonStyle.Secondary
          )
          .setDisabled(subcommand === "messages")
      ),
    ];

    const options: MessageReplyOptions = {
      embeds: await generateEmbed(subcommand),
    };

    if (!args[0]) options.components = generateButtons(subcommand);

    const msg = await message.channel.send(options);

    if (!args[0]) {
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (i) => {
        if (
          i.customId !== "xp-leaderboard" &&
          i.customId !== "messages-leaderboard"
        )
          return;

        subcommand = i.customId.split("-leaderboard")[0];

        i.update({
          embeds: await generateEmbed(subcommand),
          components: generateButtons(subcommand),
        });
      });
    }
  },
});
