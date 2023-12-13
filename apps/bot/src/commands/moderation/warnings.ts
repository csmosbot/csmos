import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { db } from "@csmos/db";
import { time } from "discord.js";

export default new Command({
  name: "warnings",
  description: "View all warnings of a user.",
  aliases: ["warns"],
  usage: "warnings [user]",
  permissions: ["Moderate Members (to view other users' warnings)"],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    if (
      member.id !== message.member.id &&
      !message.member.permissions.has("ModerateMembers")
    )
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "You do not have permission to view other users' warnings."
          ),
        ],
      });

    const { warnings } = await db.user.upsert({
      where: {
        id: message.author.id,
        guildId: message.guild.id,
      },
      create: {
        id: message.author.id,
        guildId: message.guild.id,
      },
      update: {},
      include: {
        warnings: true,
      },
    });

    if (!warnings.length)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `${
              member.id === message.member.id
                ? "You don't"
                : `**${member.user.username}** doesn't`
            } have any warnings yet.`
          ),
        ],
      });

    message.channel.send({
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
