import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";

export default new Command({
  name: "unmute",
  description: "Unmute a user from this server.",
  aliases: ["untimeout", "removetimeout", "remove-timeout", "rmtimeout"],
  userPermissions: ["ModerateMembers"],
  usage: "unmute <user> [reason]",
  examples: [
    {
      example: "unmute @ToastedToast wrong user",
      description: "unmute @ToastedToast for the reason 'wrong user'",
    },
  ],
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
        embeds: [
          new DangerEmbed().setDescription("You can't unmute yourself."),
        ],
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
            `I cannot unmute **${member.user.username}**.`
          ),
        ],
      });
    if (!member.isCommunicationDisabled())
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** is not muted.`
          ),
        ],
      });

    const reason = args.slice(1).join(" ") || "No reason specified.";

    member.timeout(null, reason);

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been unmuted from this server.`
        ),
      ],
    });
  },
});
