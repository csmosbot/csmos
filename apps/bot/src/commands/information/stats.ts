import { Command } from "@/structures/command.js";
import { Embed } from "@/utils/embed.js";
import { getPrefix } from "@/utils/prefix.js";

export default new Command({
  name: "stats",
  description: "View a user's statistics.",
  aliases: ["statistics"],
  usage: "stats [user]",
  run: ({ client, message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    client.db.users.ensure(member.id, {
      messages: 0,
      characters: 0,
    });

    const data = client.db.users.get(member.id);
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
                `You can also view these statistics by running \`${getPrefix(
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
