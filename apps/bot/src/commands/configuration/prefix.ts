import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { updateGuild } from "@csmos/db";

export default new Command({
  name: "prefix",
  description: "Update the prefix for a server.",
  userPermissions: ["ManageGuild"],
  usage: "prefix <new prefix>",
  examples: [
    {
      example: "prefix ?",
      description: "set the prefix to '?'",
    },
  ],
  run: async ({ message, args }) => {
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

    await updateGuild(message.guild.id, {
      prefix,
    });

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `My prefix in this server is now \`${prefix}\`.`
        ),
      ],
    });
  },
});
