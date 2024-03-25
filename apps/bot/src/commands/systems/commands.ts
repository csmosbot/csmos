import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import {
  createCommand,
  getCommandByName,
  getCommands,
  updateCommand,
} from "@csmos/db";
import {
  ActionRowBuilder,
  ComponentType,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update a command.")
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("The command you want to update.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),
  autocomplete: async ({ interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = (await getCommands(interaction.guild!.id)).map(
      (command) => command.name
    );
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
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
      case "update":
        {
          const commandName = interaction.options.getString("command", true);
          const command = await getCommandByName(
            commandName,
            interaction.guild.id
          );
          if (!command)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `No command exists with name \`${commandName}\`.`
                ),
              ],
            });

          const modal = new ModalBuilder()
            .setCustomId("commandUpdateModal")
            .setTitle(`Update ${command.name}`);

          const inputs = [
            new TextInputBuilder()
              .setCustomId("name")
              .setLabel("Name")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(32)
              .setValue(command.name),
            new TextInputBuilder()
              .setCustomId("description")
              .setLabel("Description")
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(100)
              .setValue(command.description),
            new TextInputBuilder()
              .setCustomId("response")
              .setLabel("Response")
              .setStyle(TextInputStyle.Paragraph)
              .setValue(command.response),
          ];

          modal.addComponents(
            ...inputs.map((input) =>
              new ActionRowBuilder<TextInputBuilder>().addComponents(input)
            )
          );

          await interaction.showModal(modal);

          const submitted = await interaction
            .awaitModalSubmit({
              time: 120_000,
              filter: (i) => i.user.id === interaction.user.id,
            })
            .catch((err) => {
              console.error(err);
              return null;
            });
          if (submitted) {
            const name = submitted.fields.getTextInputValue("name");
            const description =
              submitted.fields.getTextInputValue("description");
            const response = submitted.fields.getTextInputValue("response");

            await updateCommand(command.id, {
              name,
              description,
              response,
            });

            submitted.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Command \`${name}\` has been updated.`
                ),
              ],
              ephemeral: true,
            });
          }
        }
        break;
    }
  },
});
