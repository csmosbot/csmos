import { SlashCommand } from "@/structures/command";
import { config } from "@/utils/config";
import { Connect4 } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("connect4")
    .setDescription("Play a game of Connect 4 against someone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to play Connect 4 against.")
        .setRequired(true)
    ),
  run: ({ interaction }) => {
    const member = interaction.options.getUser("user", true);

    const game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: member,
      embed: {
        title: "Connect 4",
        statusTitle: "Status",
        color: config.colors.primary,
      },
      emojis: {
        board: "⚪",
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      turnMessage: "{emoji} It is currently the turn of **{player}**.",
      winMessage: "{emoji} **{player}** won. Congratulations!",
      tieMessage: "The game was a tie, so no one won.",
      timeoutMessage: "The game timed out, so no one won.",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });
    game.startGame();
  },
});
