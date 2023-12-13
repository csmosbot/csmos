import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { createAfk, deleteAfk, getAfk } from "@csmos/db";

export default new Command({
  name: "afk",
  description: "Set or remove your AFK status.",
  usage: ["afk <reason>", "afk reset"],
  examples: [
    {
      example: "afk eating",
      description: "set your afk status to 'eating'",
    },
    {
      example: "afk reset",
      description: "reset your afk status",
    },
  ],
  run: async ({ message, args }) => {
    const reasonOrSubcommand = args.join(" ") ?? "No reason specified.";
    const data = await getAfk(message.author.id, message.guild.id);

    switch (reasonOrSubcommand) {
      default:
        {
          if (data)
            return message.channel.send({
              embeds: [
                new DangerEmbed().setDescription(
                  `You are already AFK. Try using \`${await getPrefix(
                    message.guild.id
                  )}afk reset\` instead.`
                ),
              ],
            });

          await createAfk({
            userId: message.author.id,
            guildId: message.guild.id,
            reason: reasonOrSubcommand,
          });

          message.channel.send({
            embeds: [new SuccessEmbed().setDescription("You are now AFK.")],
          });
        }
        break;
      case "reset":
        {
          if (!data)
            return message.channel.send({
              embeds: [
                new DangerEmbed().setDescription(
                  `You are not currently AFK. Try using \`${await getPrefix(
                    message.guild.id
                  )}afk <reason>\` instead.`
                ),
              ],
            });

          await deleteAfk(data.id);

          message.channel.send({
            embeds: [
              new SuccessEmbed().setDescription(
                "Welcome back! I've removed your AFK."
              ),
            ],
          });
        }
        break;
    }
  },
});
