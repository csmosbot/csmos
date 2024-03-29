import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { createReactionRole } from "@csmos/db";
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
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "create": {
        const messageLink = interaction.options.getString("message_link", true);
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
    }
  },
});
