import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { RockPaperScissors } from "discord-gamecord";

export default new Command({
  name: "rockpaperscissors",
  description: "Play a game of Rock Paper Scissors against someone.",
  aliases: ["rps"],
  usage: "rockpaperscissors <user>",
  examples: [
    {
      example: "rockpaperscissors @ToastedToast",
      description: "play rock paper scissors against @ToastedToast",
    },
  ],
  run: ({ message, args }) => {
    const member =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0])?.user;
    if (!member)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The user to battle against must be specified."
          ),
        ],
      });

    const Game = new RockPaperScissors({
      message,
      isSlashGame: false,
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
