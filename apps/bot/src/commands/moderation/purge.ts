import { Command } from "@/structures/command";
import { DangerEmbed } from "@/utils/embed";
import ms from "ms";

export default new Command({
  name: "purge",
  description: "Purge a number of messages from the channel you're in.",
  userPermissions: ["ManageMessages"],
  usage: "purge <number of messages>",
  examples: [
    {
      example: "purge 10",
      description: "purge 10 messages in the channel you're in",
    },
  ],
  run: async ({ message, args }) => {
    if (!args[0])
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of messages to delete must be specified."
          ),
        ],
      });

    const amount = parseInt(args[0]);
    if (isNaN(amount))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of messages to delete must be a number."
          ),
        ],
      });
    if (amount > 100)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of messages to delete cannot be higher than 100."
          ),
        ],
      });

    const messages = await message.channel.messages.fetch({
      limit: amount + 1,
    });
    const filtered = messages.filter(
      (msg) => Date.now() - msg.createdTimestamp < ms("14 days") && !msg.pinned
    );

    await message.delete();
    await message.channel.bulkDelete(filtered);
  },
});
