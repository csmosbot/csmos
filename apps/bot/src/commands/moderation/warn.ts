import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { db } from "@csmos/db";

export default new Command({
  name: "warn",
  description: "Warn a user in this server.",
  userPermissions: ["ModerateMembers"],
  usage: "warn <user> [reason]",
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A member must be specified."),
        ],
      });
    if (member.id === message.member.id)
      return message.channel.send({
        embeds: [new DangerEmbed().setDescription("You can't warn yourself.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** has a higher/equal role to yours.`
          ),
        ],
      });
    if (!member.moderatable)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot warn **${member.user.username}**.`
          ),
        ],
      });

    const reason = args.slice(1).join(" ") || "No reason specified";

    await db.warning.create({
      data: {
        userId: member.id,
        moderatorId: message.author.id,
        reason,
      },
    });

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been warned in this server.`
        ),
      ],
    });

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been warned in ${message.guild.name}.`)
            .setFields(
              {
                name: "Warned by",
                value: `${message.member} (${message.member.id})`,
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
                inline: true,
              }
            ),
        ],
      })
      .catch(() => null);
  },
});
