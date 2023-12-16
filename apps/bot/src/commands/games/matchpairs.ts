import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { MatchPairs } from "discord-gamecord";

export default new Command({
  name: "matchpairs",
  description: "Play a game of Match Pairs.",
  examples: [
    {
      description: "play a game of match pairs",
    },
  ],
  run: ({ message }) => {
    const game = new MatchPairs({
      message,
      isSlashGame: false,
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
