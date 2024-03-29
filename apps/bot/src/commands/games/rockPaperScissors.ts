import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { RockPaperScissors } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play a game of Rock Paper Scissors against someone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to play Rock Paper Scissors against.")
        .setRequired(true)
    ),
  run: ({ interaction }) => {
    const member = interaction.options.getUser("user");

    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: true,
      opponent: member,
      embed: {
        title: "Rock Paper Scissors",
        color: config.colors.primary,
        description: "Press a button below to make a choice.",
      },
      buttons: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      emojis: {
        rock: "🪨",
        paper: "📄",
        scissors: "✂️",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "SECONDARY",
      pickMessage: "You chose {emoji}.",
      winMessage: "**{player}** won! Congratulations!",
      tieMessage: "The game was a tie, so no one won.",
      timeoutMessage: "The game timed out, so no one won.",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });
    Game.startGame();
  },
});
