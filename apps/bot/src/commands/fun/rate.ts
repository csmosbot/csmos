import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { random } from "@/utils/random";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("rate")
    .setDescription("Rate something.")
    .addStringOption((option) =>
      option
        .setName("thing")
        .setDescription("The thing to rate.")
        .setRequired(true)
    ),
  run: ({ interaction }) => {
    const something = interaction.options.getString("thing");

    const rating = random(0, 100);
    interaction.reply({
      embeds: [
        new Embed()
          .setTitle("⭐ Rating")
          .setDescription(`I rate **${something}** a **${rating}/100**.`),
      ],
    });
  },
});
