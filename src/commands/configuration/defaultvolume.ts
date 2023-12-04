import { Command } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";

export default new Command({
  name: "defaultvolume",
  description: "Update the default volume for this server.",
  aliases: ["default-volume"],
  usage: "defaultvolume <new volume percentage>",
  run: ({ client, message, args }) => {
    if (!args[0])
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The new default volume percentage must be specified."
          ),
        ],
      });

    const volume = parseInt(args[0]);
    if (isNaN(volume))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The new default volume percentage must be a number."
          ),
        ],
      });
    if (volume <= 0)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The new default volume percentage must be lower than 0%."
          ),
        ],
      });
    if (volume >= 150)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The new default volume percentage must be lower than 150%."
          ),
        ],
      });

    client.db.guilds.set(message.guild.id, volume, "defaultVolume");

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `Updated default volume to **${volume}%**.`
        ),
      ],
    });
  },
});
