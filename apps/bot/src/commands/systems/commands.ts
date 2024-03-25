import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { createCommand, getCommandByName } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Create, update, and delete commands.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a command.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name for the command.")
            .setMinLength(1)
            .setMaxLength(32)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description for the command.")
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("How csmos responds when someone uses the command.")
            .setRequired(true)
        )
    ),
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "create":
        {
          const name = interaction.options.getString("name", true);
          if (
            !name.match(
              /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u
            )
          )
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "Invalid command name specified."
                ),
              ],
              ephemeral: true,
            });

          const existingCommand = await getCommandByName(
            name,
            interaction.guild.id
          );
          if (existingCommand)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `A command with the name \`${name}\` already exists.`
                ),
              ],
              ephemeral: true,
            });

          if (client.commands.get(name))
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `The name \`${name}\` is reversed for this bot.`
                ),
              ],
              ephemeral: true,
            });

          const description = interaction.options.getString(
            "description",
            true
          );
          const response = interaction.options.getString("response", true);

          await createCommand({
            guildId: interaction.guild.id,
            name,
            description,
            response,
          });

          await interaction.guild.commands.create({
            name,
            description,
          });

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                `Command \`${name}\` has been created.`
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
});
