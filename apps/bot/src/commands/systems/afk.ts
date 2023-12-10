import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { db } from "@csmos/db";

export default new Command({
  name: "afk",
  description: "Set or remove your AFK status.",
  usage: 'afk <reason | "reset">',
  run: async ({ client, message, args }) => {
    const reasonOrSubcommand = args.join(" ") ?? "No reason specified.";
    const data = await db.afk.findFirst({
      where: {
        userId: message.author.id,
      },
    });
    if (reasonOrSubcommand.toLowerCase() === "reset") {
      if (!data)
        return message.channel.send({
          embeds: [
            new DangerEmbed().setDescription(
              `You are not currently AFK. Try using \`${await getPrefix(
                client,
                message.guild.id
              )}afk <reason>\` instead.`
            ),
          ],
        });

      await db.afk.delete({
        where: {
          id: data.id,
        },
      });

      message.channel.send({
        embeds: [
          new SuccessEmbed().setDescription(
            "Welcome back! I've removed your AFK."
          ),
        ],
      });
    }

    if (data)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `You are already AFK. Try using \`${await getPrefix(
              client,
              message.guild.id
            )}afk reset\` instead.`
          ),
        ],
      });

    await db.afk.create({
      data: {
        userId: message.author.id,
        reason: reasonOrSubcommand,
      },
    });

    message.channel.send({
      embeds: [new SuccessEmbed().setDescription("You are now AFK.")],
    });
  },
});
