import { Command } from "@/structures/command";
import { DangerEmbed } from "@/utils/embed";
import { Emojify } from "discord-gamecord";

export default new Command({
  name: "emojify",
  description: "Convert text into emojis.",
  usage: "emojify <text>",
  examples: [
    {
      example: "emojify csmos is awesome",
      description: "converts the text 'csmos is awesome' into emojis",
    },
  ],
  run: async ({ message, args }) => {
    const text = args.join(" ");
    if (!text)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The text to convert into emojis must be specified."
          ),
        ],
      });

    message.channel.send(await Emojify(text));
  },
});
