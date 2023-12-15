import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { coinflip, randomChoice } from "@/utils/games";

export default new Command({
  name: "coinflip",
  description: "Flip a coin.",
  aliases: [
    "cf",
    "flip",
    "coin",
    "flipacoin",
    "flip-a-coin",
    "coin-flip",
    "cointoss",
  ],
  examples: [
    {
      description: "flip a coin",
    },
  ],
  run: ({ message }) => {
    const choice = randomChoice(coinflip.outcomes);
    message.channel.send({
      embeds: [
        new Embed()
          .setTitle("🪙 Coin Flip")
          .setDescription(`It was **${choice}**!`),
      ],
    });
  },
});
