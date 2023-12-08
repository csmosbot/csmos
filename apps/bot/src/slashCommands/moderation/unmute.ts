import { SlashCommand } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a user from this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to unmute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why you are unmuting this user.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  run: ({ interaction }) => {
    const member = interaction.options.getMember("user");
    if (!member)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription("A member must be specified."),
        ],
        ephemeral: true,
      });
    if (member.id === interaction.member.id)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription("You can't unmute yourself."),
        ],
        ephemeral: true,
      });
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** has a higher/equal role to yours.`
          ),
        ],
        ephemeral: true,
      });
    if (!member.moderatable)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot unmute **${member.user.username}**.`
          ),
        ],
        ephemeral: true,
      });
    if (!member.isCommunicationDisabled())
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** is not muted.`
          ),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.timeout(null, reason);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been unmuted from this server.`
        ),
      ],
      ephemeral: true,
    });
  },
});
