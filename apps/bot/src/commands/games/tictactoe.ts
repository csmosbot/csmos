import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { TicTacToe } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play a game of TicTacToe against someone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to play TicTacToe against.")
        .setRequired(true)
    ),
  run: ({ interaction }) => {
    const member = interaction.options.getUser("user");

    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: member,
      embed: {
        title: "TicTacToe",
        color: config.colors.primary,
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "<:tttplayer1:1059282365605761025>",
        oButton: "<:tttplayer2:1059282368294309938>",
        blankButton: "<:empty:1059285599477051563>",
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} It is currently the turn of **{player}**.",
      winMessage: "{emoji} **{player}** won. Congratulations!",
      tieMessage: "The game was a tie, so no one won.",
      timeoutMessage: "The game timed out, so no one won.",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });
    Game.startGame();
  },
});
