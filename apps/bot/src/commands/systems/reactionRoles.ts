import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import {
  createReactionRole,
  deleteReactionRole,
  featureIsDisabled,
  getReactionRole,
  getReactionRoles,
} from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("reaction-roles")
    .setDescription("Create, update, and delete reaction roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a reaction role.")
        .addStringOption((option) =>
          option
            .setName("message_link")
            .setDescription("A link to the message to react to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to react with.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to give when someone reacts.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a reaction role.")
        .addStringOption((option) =>
          option
            .setName("reaction_role")
            .setDescription("The reaction role to delete.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),
  autocomplete: async ({ interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = (await getReactionRoles(interaction.guild.id)).map(
      (reactionRole) => ({
        content: `${reactionRole.emoji} (message ID: ${reactionRole.messageId})`,
        id: reactionRole.id,
      })
    );
    const filtered = choices.filter((choice) =>
      choice.content.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice.content, value: choice.id }))
    );
  },
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "reaction_roles"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The reaction roles system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "create":
        {
          const messageLink = interaction.options.getString(
            "message_link",
            true
          );
          if (!messageLink.startsWith("https://discord.com/channels/"))
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "Invalid message link provided."
                ),
              ],
              ephemeral: true,
            });

          const [, channelId, messageId] = messageLink
            .replace("https://discord.com/channels/", "")
            .split("/");
          if (!channelId || !messageId)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "Invalid message link provided."
                ),
              ],
              ephemeral: true,
            });

          let channel = interaction.guild.channels.cache.get(channelId);
          if (!channel) {
            channel =
              (await interaction.guild.channels.fetch(channelId)) ?? undefined;
          }
          if (!channel)
            return interaction.reply({
              embeds: [new DangerEmbed().setDescription("Channel not found.")],
              ephemeral: true,
            });
          if (!channel.isTextBased())
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription("Channel must be text based."),
              ],
              ephemeral: true,
            });

          const message = await channel.messages.fetch(messageId);
          if (!message)
            return interaction.reply({
              embeds: [new DangerEmbed().setDescription("Message not found.")],
              ephemeral: true,
            });

          const emoji = interaction.options.getString("emoji", true);
          const role = interaction.options.getRole("role", true);

          if (
            role.position >=
            (await interaction.guild.members.fetchMe()).roles.highest.position
          )
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `I cannot add the role **${role.name}** to other members because it is higher/equal to my role. Please select another role or move my role above **${role.name}**`
                ),
              ],
              ephemeral: true,
            });

          await createReactionRole({
            guildId: interaction.guild.id,
            channelId,
            messageId,
            emoji,
            roleId: role.id,
          });
          await message.react(emoji);

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                `Reaction role ${emoji} created for **${role.name}**.`
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "delete": {
        const id = interaction.options.getString("reaction_role", true);
        const reactionRole = await getReactionRole(id);
        if (!reactionRole)
          return interaction.reply({
            embeds: [
              new DangerEmbed().setDescription("No reaction role found."),
            ],
            ephemeral: true,
          });

        await deleteReactionRole(reactionRole.id);

        let channel = interaction.guild.channels.cache.get(
          reactionRole.channelId
        );
        if (!channel) {
          channel =
            (await interaction.guild.channels.fetch(reactionRole.channelId)) ??
            undefined;
        }
        if (channel && channel.isTextBased()) {
          const message = await channel.messages.fetch(reactionRole.messageId);
          if (message)
            await message.reactions.cache
              .find(
                (reaction) =>
                  (reaction.emoji.name ?? reaction.emoji.id!) ===
                  reactionRole.emoji
              )
              ?.remove();
        }

        interaction.reply({
          embeds: [
            new SuccessEmbed().setDescription(
              `Reaction role ${reactionRole.emoji} has been deleted.`
            ),
          ],
          ephemeral: true,
        });
      }
    }
  },
});
