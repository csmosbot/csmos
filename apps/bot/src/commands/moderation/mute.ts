import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import ms from "ms";

export default new Command({
  name: "mute",
  description: "Mute a user from this server.",
  aliases: ["timeout"],
  userPermissions: ["ModerateMembers"],
  usage: "mute <user> <time> [reason]",
  run: ({ message, args }) => {
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
        embeds: [new DangerEmbed().setDescription("You can't mute yourself.")],
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
            `I cannot mute **${member.user.username}**.`
          ),
        ],
      });
    if (member.isCommunicationDisabled())
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** is already muted.`
          ),
        ],
      });

    const length = args[1];
    if (!length)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A mute length must be specified."),
        ],
      });
    if (!ms(length))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The mute length you specified is invalid."
          ),
        ],
      });

    const reason = args.slice(2).join(" ") || "No reason specified.";

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been muted from ${message.guild.name}.`)
            .setFields(
              {
                name: "Muted by",
                value: `${message.member} (${message.member.id})`,
                inline: true,
              },
              {
                name: "Length",
                value: ms(ms(length), { long: true }),
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

    member.timeout(ms(length), reason);

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been muted from this server.`
        ),
      ],
    });
  },
});
