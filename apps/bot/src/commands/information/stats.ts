import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { getUser } from "@csmos/db";

export default new Command({
  name: "stats",
  description: "View a user's statistics.",
  aliases: ["statistics"],
  usage: ["stats", "stats <user>"],
  examples: [
    {
      description: "view your own stats",
    },
    {
      example: "stats @ToastedToast",
      description: "view @ToastedToast's stats",
    },
  ],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const data = await getUser(member.id, message.guild.id);
    message.channel.send({
      embeds: [
        new Embed()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .addFields(
            {
              name: "Leveling",
              value: [
                `You can also view these statistics by running \`${await getPrefix(
                  message.guild.id
                )}rank\`.`,
                `• **XP**: ${data.xp}`,
                `• **Level**: ${data.level}`,
              ].join("\n"),
            },
            {
              name: "Messages",
              value: [
                `• **Messages**: ${data.messages}`,
                `• **Characters**: ${data.characters}`,
              ].join("\n"),
            }
          ),
      ],
    });
  },
});
