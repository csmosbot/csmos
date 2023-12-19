import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";

export default new Command({
  name: "membercount",
  description: "View the amount of members in a server.",
  examples: [
    {
      description: "view the amount of members in the server you're in",
    },
  ],
  run: async ({ message }) => {
    const members = message.guild.memberCount;
    const users = message.guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    const bots = message.guild.members.cache.filter(
      (member) => member.user.bot
    ).size;

    message.channel.send({
      embeds: [
        new Embed()
          .setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL() ?? undefined,
          })
          .addFields(
            {
              name: "Members",
              value: members.toLocaleString(),
              inline: true,
            },
            {
              name: "Users",
              value: users.toLocaleString(),
              inline: true,
            },
            {
              name: "Bots",
              value: bots.toLocaleString(),
              inline: true,
            }
          ),
      ],
    });
  },
});
