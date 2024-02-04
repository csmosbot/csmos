import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { replaceVars } from "@/utils/variables";
import {
  createGuild,
  createWelcomer,
  deleteWelcomer,
  getGuild,
  getWelcomer,
  updateWelcomer,
} from "@csmos/db";
import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("welcomer")
    .setDescription("Configure the welcomer system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the welcomer system.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to use for welcoming new users.")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to use as the welcome channel.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("preview")
        .setDescription("Preview your welcome message.")
    )
    .addSubcommandGroup((group) =>
      group
        .setName("update")
        .setDescription("Update the welcomer system.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("channel")
            .setDescription("Update the welcome channel.")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The new welcome channel.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("message")
            .setDescription("Update the welcome message.")
            .addStringOption((option) =>
              option
                .setName("message")
                .setDescription("The new welcome message.")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the welcomer system.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction }) => {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const welcomer = await getWelcomer(interaction.guild.id);

    if (subcommand === "setup") {
      if (welcomer)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The welcomer system is already enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      const message = interaction.options.getString("message", true);
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;
      if (!channel || !channel.isTextBased())
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "A text channel must be specified."
            ),
          ],
          ephemeral: true,
        });

      if (!(await getGuild(interaction.guild.id)))
        await createGuild(interaction.guild.id);

      await createWelcomer({
        guildId: interaction.guild.id,
        channelId: channel.id,
        message,
      });

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "The welcomer system has been enabled."
          ),
        ],
        ephemeral: true,
      });
    } else if (subcommand === "preview") {
      if (!welcomer)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The welcomer system is not enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      interaction.reply({
        content: replaceVars({
          message: welcomer.message,
          user: interaction.user,
          guild: interaction.guild,
        }),
        ephemeral: true,
      });
    } else if (group === "update") {
      if (!welcomer)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The welcomer system is not enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      switch (subcommand) {
        case "channel":
          {
            const channel = interaction.options.getChannel("channel", true);
            if (!channel || !channel.isTextBased())
              return interaction.reply({
                embeds: [
                  new DangerEmbed().setDescription(
                    "A text channel must be specified."
                  ),
                ],
                ephemeral: true,
              });

            await updateWelcomer(interaction.guild.id, {
              channelId: channel.id,
            });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  "The welcome channel has been updated."
                ),
              ],
              ephemeral: true,
            });
          }
          break;
        case "message":
          {
            const message = interaction.options.getString("message", true);

            await updateWelcomer(interaction.guild.id, { message });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  "The welcome message has been updated."
                ),
              ],
              ephemeral: true,
            });
          }
          break;
      }
    } else if (subcommand === "disable") {
      if (!welcomer)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The welcomer system is not enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      await deleteWelcomer(welcomer.id);

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "The welcomer system has been disabled."
          ),
        ],
        ephemeral: true,
      });
    }
  },
});
