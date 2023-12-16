import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { TwoZeroFourEight } from "discord-gamecord";

export default new Command({
  name: "2048",
  description: "Play a game of 2048.",
  aliases: [
    "twozerofoureight",
    "two-zero-four-eight",
    "twentyfourtyeight",
    "twenty-fourtyeight",
    "twenty-fourty-eight",
  ],
  examples: [
    {
      description: "play a game of 2048",
    },
  ],
  run: ({ message }) => {
    const game = new TwoZeroFourEight({
      message,
      isSlashGame: false,
      embed: {
        title: "2048",
        color: config.colors.primary,
      },
      emojis: {
        up: "<:up:1059101020921286726>",
        down: "<:down:1059101028844318730>",
        left: "<:left:1059101031469953084>",
        right: "<:right:1059101034263367780>",
      },
      timeoutTime: 60000,
      buttonStyle: "SECONDARY",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });
    game.startGame();
  },
});
