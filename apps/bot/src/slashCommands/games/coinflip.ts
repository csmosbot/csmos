import { SlashCommand } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { coinflip, randomChoice } from "@/utils/games";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin."),
  run: ({ interaction }) => {
    const choice = randomChoice(coinflip.outcomes);
    interaction.reply({
      embeds: [
        new Embed()
          .setTitle("🪙 Coin Flip")
          .setDescription(`It was **${choice}**!`),
      ],
    });
  },
});
