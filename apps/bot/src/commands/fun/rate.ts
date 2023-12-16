import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { random } from "@/utils/random";

export default new Command({
  name: "rate",
  description: "Rate something.",
  usage: "rate <thing to rate>",
  examples: [
    {
      example: "rate csmos",
      description: "rate 'csmos'",
    },
  ],
  run: ({ message, args }) => {
    const something = args.join(" ");
    if (!something)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The thing to rate must be specified."
          ),
        ],
      });

    const rating = random(0, 100);
    message.channel.send({
      embeds: [
        new Embed()
          .setTitle("⭐ Rating")
          .setDescription(`I rate **${something}** a **${rating}/100**.`),
      ],
    });
  },
});
