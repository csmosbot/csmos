import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";

export default new Command({
  name: "roles",
  description: "Add or remove roles from a user.",
  aliases: ["role"],
  userPermissions: ["ManageRoles"],
  usage: ["roles add <role> [user]", "roles remove <role> [user]"],
  examples: [
    {
      example: "roles add @Astronaut",
      description: "add the @Astronaut role to yourself",
    },
    {
      example: "roles remove @Astronaunt @ToastedToast",
      description: "remove the @Astronaut role from @ToastedToast",
    },
  ],
  run: async ({ message, args }) => {
    const subcommand = args[0];
    if (!subcommand)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Subcommand must be specified. Subcommand can be either `add` or `remove`."
          ),
        ],
      });
    if (!["add", "remove"].includes(subcommand))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Invalid subcommand specified. Subcommand can be either `add` or `remove`."
          ),
        ],
      });

    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!role)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `Role to be ${subcommand}ed must be specified.`
          ),
        ],
      });
    if (
      role.managed ||
      role.position >= message.guild.members.me!.roles.highest.position
    )
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ${subcommand} **${role.name}** ${
              subcommand === "add" ? "to" : "from"
            } users.`
          ),
        ],
      });

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[2]) ||
      message.member;
    if (
      member.id !== message.member.id &&
      member.roles.highest.position >= message.member.roles.highest.position
    )
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** has a higher/equal role to yours.`
          ),
        ],
      });
    if (!member.manageable)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ${
              subcommand === "add" ? "add roles to" : "remove roles from"
            } **${member.user.username}**.`
          ),
        ],
      });

    await member.fetch();

    switch (subcommand) {
      case "add":
        {
          if (member.roles.cache.has(role.id))
            return message.channel.send({
              embeds: [
                new DangerEmbed().setDescription(
                  `**${member.user.username}** already has the role **${role.name}**.`
                ),
              ],
            });
          await member.roles.add(role);
        }
        break;
      case "remove":
        {
          if (!member.roles.cache.has(role.id))
            return message.channel.send({
              embeds: [
                new DangerEmbed().setDescription(
                  `**${member.user.username}** does not have the role **${role.name}**.`
                ),
              ],
            });
          await member.roles.remove(role);
        }
        break;
    }

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${role.name}** has been ${
            subcommand === "add" ? "added to" : "removed from"
          } **${member.user.username}**.`
        ),
      ],
    });
  },
});
