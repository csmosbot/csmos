import { SlashCommand } from "@/structures/command";
import { Emojify } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("Convert text into emojis.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to convert into emojis.")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const text = interaction.options.getString("text");
    interaction.reply(await Emojify(text));
  },
});
