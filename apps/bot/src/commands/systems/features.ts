import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import {
  type Feature,
  disableFeature,
  enableFeature,
  featureIsDisabled,
  featuresEnum,
} from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export default new Command({
  data: new SlashCommandBuilder()
    .setName("features")
    .setDescription("Enable or disable features of csmos.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable a feature of csmos.")
        .addStringOption((option) =>
          option
            .setName("feature")
            .setDescription("The feature to enable.")
            .addChoices(
              ...featuresEnum.enumValues.map((enumValue) => ({
                name:
                  enumValue === "afk"
                    ? "AFK"
                    : enumValue
                        .split("_")
                        .map((x) => capitalize(x))
                        .join(" "),
                value: enumValue,
              }))
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable a feature of csmos.")
        .addStringOption((option) =>
          option
            .setName("feature")
            .setDescription("The feature to disable.")
            .addChoices(
              ...featuresEnum.enumValues.map((enumValue) => ({
                name:
                  enumValue === "afk"
                    ? "AFK"
                    : enumValue
                        .split("_")
                        .map((x) => capitalize(x))
                        .join(" "),
                value: enumValue,
              }))
            )
            .setRequired(true)
        )
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    const feature = interaction.options.getString("feature", true);
    const featureDisabled = await featureIsDisabled(
      interaction.guild.id,
      feature as Feature
    );
    if (subcommand === "enable" ? !featureDisabled : featureDisabled)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `The ${
              feature === "afk"
                ? "AFK"
                : feature
                    .split("_")
                    .map((x) => capitalize(x))
                    .join(" ")
            } feature is already ${subcommand}d.`
          ),
        ],
        ephemeral: true,
      });

    (subcommand === "enable" ? enableFeature : disableFeature)(
      interaction.guild.id,
      feature as Feature
    );

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `The ${
            feature === "afk"
              ? "AFK"
              : feature
                  .split("_")
                  .map((x) => capitalize(x))
                  .join(" ")
          } feature has been ${subcommand}d.`
        ),
      ],
      ephemeral: true,
    });
  },
});
