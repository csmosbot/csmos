import { SlashCommand } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { random } from "@/utils/random";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice."),
  run: ({ interaction }) => {
    const result = random(1, 6);
    interaction.reply({
      embeds: [
        new Embed()
          .setTitle("🎲 Dice Roll")
          .setDescription(`It landed on **${result}**!`),
      ],
    });
  },
});
