import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { TwoZeroFourEight } from "discord-gamecord";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("2048")
    .setDescription("Play a game of 2048."),
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

    const game = new TwoZeroFourEight({
      message: interaction,
      isSlashGame: true,
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
