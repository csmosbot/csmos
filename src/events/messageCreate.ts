import { Event } from "@/structures/event.js";
import { config } from "@/utils/config.js";

function escapeRegex(str: string) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(e);
  }
}

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    // TODO: update this to db
    const prefix = config.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, mPrefix] = message.content.match(prefixRegex)!;
    const [cmd, ...args] = message.content
      .slice(mPrefix.length)
      .trim()
      .split(/ +/);

    // TODO: handle mention

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    try {
      // TODO: handle perms

      await command.run({ client, message, args });
    } catch (err) {
      console.error(err);
    }
  },
});
