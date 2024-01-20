import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { eightBall, randomChoice } from "@/utils/games";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask a question to the magic 8 ball.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask to the magic 8 ball.")
        .setRequired(true)
    ),
  run: ({ interaction }) => {
    const question = interaction.options.getString("question", true);
    const response = randomChoice(eightBall.choices);

    interaction.reply({
      embeds: [
        new Embed().setTitle("🎱 8 Ball").addFields(
          {
            name: "Question",
            value: question,
          },
          {
            name: "Answer",
            value: response,
          }
        ),
      ],
    });
  },
});
