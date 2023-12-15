import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { random } from "@/utils/random";

export default new Command({
  name: "roll",
  description: "Roll a dice",
  aliases: ["dice", "rolladice", "roll-a-dice"],
  examples: [
    {
      description: "roll a dice",
    },
  ],
  run: ({ message }) => {
    const result = random(1, 6);
    message.channel.send({
      embeds: [
        new Embed()
          .setTitle("🎲 Dice Roll")
          .setDescription(`It landed on **${result}**!`),
      ],
    });
  },
});
