import { Command } from "@/structures/command.js";
import { DangerEmbed, Embed } from "@/utils/embed.js";
import { time } from "discord.js";

export default new Command({
  name: "warnings",
  description: "View all warnings of a user.",
  run: ({ client, message, args }) => {
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

    client.db.users.ensure(member.id, {
      xp: 0,
      level: 0,
      warnings: [],
    });

    const warnings = client.db.users
      .get(member.id, "warnings")
      .filter((warning) => warning.guildId === message.guild.id);

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
