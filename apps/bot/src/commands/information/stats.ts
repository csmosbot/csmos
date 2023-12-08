import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";

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

    client.db.users.ensure(`${message.guild.id}-${member.id}`, {
      xp: 0,
      level: 0,
      messages: 0,
      characters: 0,
    });

    const data = client.db.users.get(`${message.guild.id}-${member.id}`);
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
