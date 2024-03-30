import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { MatchPairs } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("matchpairs")
    .setDescription("Play a game of Match Pairs."),
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

    const game = new MatchPairs({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Match Pairs",
        color: config.colors.primary,
        description: "Click on the buttons to match emojis with their pairs.",
      },
      timeoutTime: 60000,
      emojis: [
        "🍉",
        "🍇",
        "🍊",
        "🥭",
        "🍎",
        "🍏",
        "🥝",
        "🥥",
        "🍓",
        "🫐",
        "🍍",
        "🥕",
        "🥔",
      ],
      winMessage: "You won! You turned a total of **{tilesTurned}** tiles.",
      loseMessage: "You lost. You turned a total of **{tilesTurned}** tiles.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });
    game.startGame();
  },
});
