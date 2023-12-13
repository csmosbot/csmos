import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";

export default new Command({
  name: "ban",
  description: "Ban a user from a server.",
  userPermissions: ["BanMembers"],
  usage: "ban <user> [reason]",
  examples: [
    {
      example: "ban @ToastedToast breaking the rules",
      description: "ban @ToastedToast for the reason 'breaking the rules'",
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
        embeds: [new DangerEmbed().setDescription("You can't ban yourself.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** has a higher/equal role to yours.`
          ),
        ],
      });
    if (!member.bannable)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ban **${member.user.username}**.`
          ),
        ],
      });

    const reason = args.slice(1).join(" ") || "No reason specified.";

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been banned from ${message.guild.name}.`)
            .setFields(
              {
                name: "Banned by",
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

    member.ban({ reason });

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been banned from this server.`
        ),
      ],
    });
  },
});
