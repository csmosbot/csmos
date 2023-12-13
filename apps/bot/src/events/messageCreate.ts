import type { ExtendedMessage } from "@/structures/command";
import { Event } from "@/structures/event";
import { config } from "@/utils/config";
import { getPrefix } from "@/utils/prefix";
import { EmbedBuilder } from "discord.js";

function escapeRegex(str: string) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  } catch (e) {
    console.log(e);
  }
}

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    const prefix = await getPrefix(message.guild.id);
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, mPrefix] = message.content.match(prefixRegex)!;
    const [cmd, ...args] = message.content
      .slice(mPrefix.length)
      .trim()
      .split(/ +/);

    if (cmd.length === 0 && mPrefix.includes(client.user.id))
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("👋 Hey there!")
            .setDescription(`My prefix in this server is \`${prefix}\`.`)
            .setColor(config.colors.primary),
        ],
      });

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    try {
      if (
        command.userPermissions &&
        !message.member!.permissions.has(command.userPermissions)
      )
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("You do not have permission to use this command.")
              .setColor(config.colors.primary),
          ],
        });

      await command.run({ client, message: message as ExtendedMessage, args });
    } catch (err) {
      console.error(err);
    }
  },
});
