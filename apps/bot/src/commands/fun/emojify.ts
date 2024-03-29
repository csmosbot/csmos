import { Command } from "@/structures/command";
import { Emojify } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
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
    const text = interaction.options.getString("text", true);
    interaction.reply(
      await Promise.all(
        text
          .replaceAll(":", "")
          .split(" ")
          .map(async (text) => await Emojify(text))
      ).then((texts) => texts.join(" "))
    );
  },
});
