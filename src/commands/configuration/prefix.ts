import { Command } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { EmbedBuilder } from "discord.js";

export default new Command({
  name: "prefix",
  description: "Update the prefix for this server.",
  run: ({ client, message, args }) => {
    const prefix = args[0];
    if (!prefix)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("New prefix must be specified.")
            .setColor(config.colors.danger),
        ],
      });
    if (prefix.length > 5)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("Prefix must be less than 5 characters.")
            .setColor(config.colors.danger),
        ],
      });

    client.db.guilds.set(message.guild.id, prefix, "prefix");

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`My prefix in this server is now \`${prefix}\`!`)
          .setColor(config.colors.success),
      ],
    });
  },
});
