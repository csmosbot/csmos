import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { db } from "@csmos/db";

export default new Command({
  name: "stats",
  description: "View a user's statistics.",
  aliases: ["statistics"],
  usage: "stats [user]",
  run: async ({ client, message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const data = await db.user.upsert({
      where: {
        id: member.id,
        guildId: message.guild.id,
      },
      create: {
        id: member.id,
        guildId: message.guild.id,
      },
      update: {},
    });
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
                  client,
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
