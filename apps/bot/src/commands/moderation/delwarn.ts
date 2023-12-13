import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { db } from "@csmos/db";

export default new Command({
  name: "delwarn",
  description: "Delete a warn from a user.",
  aliases: ["deletewarn", "delete-warn", "removewarn", "remove-warn", "rmwarn"],
  userPermissions: ["ModerateMembers"],
  usage: "delwarn <warn ID>",
  examples: [
    {
      example: "delwarn cjld2cjxh0000qzrmn831i7rn",
      description: "delete the warn with ID 'cjld2cjxh0000qzrmn831i7rn'",
    },
  ],
  run: async ({ message, args }) => {
    const id = args[0];
    if (!id)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A warn ID must be specified."),
        ],
      });

    if (
      !(await db.warning.findFirst({
        where: {
          id,
        },
      }))
    )
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The warn ID you specified doesn't exist."
          ),
        ],
      });

    await db.warning.delete({
      where: {
        id,
      },
    });

    message.channel.send({
      embeds: [new SuccessEmbed().setDescription(`Removed warn **${id}**.`)],
    });
  },
});
