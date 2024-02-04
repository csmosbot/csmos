import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { replaceVars } from "@/utils/variables";
import {
  createGuild,
  createLeaver,
  deleteLeaver,
  getGuild,
  getLeaver,
  updateLeaver,
} from "@csmos/db";
import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("leaver")
    .setDescription("Configure the leaver system. test")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the leaver system.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to use for saying goodbye to users.")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to use as the goodbye channel.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("preview")
        .setDescription("Preview your goodbye message.")
    )
    .addSubcommandGroup((group) =>
      group
        .setName("update")
        .setDescription("Update the leaver system.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("channel")
            .setDescription("Update the goodbye channel.")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The new goodbye channel.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("message")
            .setDescription("Update the goodbye message.")
            .addStringOption((option) =>
              option
                .setName("message")
                .setDescription("The new goodbye message.")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("disable").setDescription("Disable the leaver system.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction }) => {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const leaver = await getLeaver(interaction.guild.id);

    if (subcommand === "setup") {
      if (leaver)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The leaver system is already enabled in this server."
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

      await createLeaver({
        guildId: interaction.guild.id,
        channelId: channel.id,
        message,
      });

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "The leaver system has been enabled."
          ),
        ],
        ephemeral: true,
      });
    } else if (subcommand === "preview") {
      if (!leaver)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The leaver system is not enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      interaction.reply({
        content: replaceVars({
          message: leaver.message,
          user: interaction.user,
          guild: interaction.guild,
        }),
        ephemeral: true,
      });
    } else if (group === "update") {
      if (!leaver)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The leaver system is not enabled in this server."
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

            await updateLeaver(interaction.guild.id, {
              channelId: channel.id,
            });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  "The goodbye channel has been updated."
                ),
              ],
              ephemeral: true,
            });
          }
          break;
        case "message":
          {
            const message = interaction.options.getString("message", true);

            await updateLeaver(interaction.guild.id, { message });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  "The goodbye message has been updated."
                ),
              ],
              ephemeral: true,
            });
          }
          break;
      }
    } else if (subcommand === "disable") {
      if (!leaver)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The leaver system is not enabled in this server."
            ),
          ],
          ephemeral: true,
        });

      await deleteLeaver(leaver.id);

      interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "The leaver system has been disabled."
          ),
        ],
        ephemeral: true,
      });
    }
  },
});
