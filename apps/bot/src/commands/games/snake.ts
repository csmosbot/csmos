import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { Snake } from "discord-gamecord";

export default new Command({
  name: "snake",
  description: "Play a game of Snake.",
  aliases: ["snek"],
  examples: [
    {
      description: "play a game of snake",
    },
  ],
  run: ({ message }) => {
    const Game = new Snake({
      message,
      isSlashGame: false,
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
