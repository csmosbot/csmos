import { SlashCommand } from "@/structures/command.js";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot."),
  run: ({ interaction }) => interaction.reply("Pong!"),
});
