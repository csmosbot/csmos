import { Command } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";

export default new Command({
  name: "kick",
  description: "Kick a user from this server.",
  userPermissions: ["KickMembers"],
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
        embeds: [new DangerEmbed().setDescription("You can't kick yourself.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** has a higher/equal role to yours.`
          ),
        ],
      });
    if (!member.kickable)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot kick **${member.user.username}**.`
          ),
        ],
      });

    const reason = args.slice(1).join(" ") || "No reason specified.";

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been kicked from ${message.guild.name}.`)
            .setFields(
              {
                name: "Kicked by",
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

    member.kick(reason);

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been kicked from this server.`
        ),
      ],
    });
  },
});
