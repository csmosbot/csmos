import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { Snake } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Play a game of Snake."),
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "games"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "Games are disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const Game = new Snake({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Snake",
        overTitle: "Game Over",
        color: config.colors.primary,
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "<:up:1059101020921286726>",
        down: "<:down:1059101028844318730>",
        left: "<:left:1059101031469953084>",
        right: "<:right:1059101034263367780>",
      },
      snake: { head: "🟢", body: "🟢", tail: "🟢", skull: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    });
    Game.startGame();
  },
});
