import { Command } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";

export default new Command({
  name: "prefix",
  description: "Update the prefix for this server.",
  userPermissions: ["ManageGuild"],
  usage: "prefix <new prefix>",
  run: ({ client, message, args }) => {
    const prefix = args[0];
    if (!prefix)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("New prefix must be specified."),
        ],
      });
    if (prefix.length > 5)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Prefix must be less than 5 characters."
          ),
        ],
      });

    client.db.guilds.set(message.guild.id, prefix, "prefix");

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `My prefix in this server is now \`${prefix}\`.`
        ),
      ],
    });
  },
});
