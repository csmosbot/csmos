import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { TicTacToe } from "discord-gamecord";

export default new Command({
  name: "tictactoe",
  description: "Play a game of TicTacToe against someone.",
  aliases: ["ttt"],
  usage: "tictactoe <user>",
  examples: [
    {
      example: "tictactoe @ToastedToast",
      description: "play tictactoe against @ToastedToast",
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

    const Game = new TicTacToe({
      message,
      isSlashGame: false,
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
