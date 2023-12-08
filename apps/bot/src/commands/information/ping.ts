import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { Embed } from "@/utils/embed";

export default new Command({
  name: "ping",
  description: "Pings the bot.",
  run: async ({ client, message }) => {
    const res = await message.channel.send({
      embeds: [
        new Embed()
          .setDescription("Pinging...")
          .setColor(config.colors.primary),
      ],
    });

    const ping = res.createdTimestamp - message.createdTimestamp;

    res.edit({
      embeds: [
        new Embed()
          .setTitle("🏓 Pong!")
          .setFields(
            {
              name: "🤖 Bot",
              value: `${ping.toLocaleString()}ms`,
              inline: true,
            },
            {
              name: "📶 API",
              value: `${client.ws.ping.toLocaleString()}ms`,
              inline: true,
            }
          )
          .setColor(config.colors.primary),
      ],
    });
  },
});
