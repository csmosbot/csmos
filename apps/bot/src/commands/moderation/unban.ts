import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";

export default new Command({
  name: "unban",
  description: "Unban a user from this server.",
  userPermissions: ["BanMembers"],
  usage: "unban <user ID>",
  examples: [
    {
      example: "unban 955408387905048637",
      description: "unban the user with the ID of '955408387905048637'",
    },
  ],
  run: async ({ message, args }) => {
    if (!message.guild.members.me!.permissions.has("BanMembers"))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "I cannot unban users in this server."
          ),
        ],
      });

    const id = args[0];
    if (!id)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "A user ID to unban must be specified."
          ),
        ],
      });

    const bans = await message.guild.bans.fetch();
    if (!bans.has(id))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The user ID specified is not banned in this server."
          ),
        ],
      });

    const user = await message.guild.members.unban(id);
    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `${
            user?.username ? `**${user.username}**` : "The user you specified"
          } has been unbanned from this server.`
        ),
      ],
    });
  },
});
