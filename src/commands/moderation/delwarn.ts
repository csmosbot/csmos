import { Command } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";

export default new Command({
  name: "delwarn",
  description: "Delete a warn from a user.",
  userPermissions: ["ModerateMembers"],
  run: ({ client, message, args }) => {
    const id = args[0];
    if (!id)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A warn ID must be specified."),
        ],
      });

    const key = client.db.users.findKey(
      (user) => !!user?.warnings?.find((warning) => warning.id === id)
    );
    if (!key)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The warn ID you specified doesn't exist."
          ),
        ],
      });

    const user = client.db.users.get(key);
    const newWarnings = user.warnings.filter((warning) => warning.id !== id);
    client.db.users.set(key, newWarnings, "warnings");

    message.channel.send({
      embeds: [new SuccessEmbed().setDescription(`Removed warn **${id}**.`)],
    });
  },
});
