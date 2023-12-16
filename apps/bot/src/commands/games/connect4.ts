import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { Connect4 } from "discord-gamecord";

export default new Command({
  name: "connect4",
  description: "Play a game of Connect 4 against someone.",
  usage: "connect4 <user>",
  examples: [
    {
      example: "connect4 @ToastedToast",
      description: "play connect 4 against @ToastedToast",
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

    const game = new Connect4({
      message,
      isSlashGame: false,
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
