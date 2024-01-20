import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why you are kicking this user.")
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
        embeds: [new DangerEmbed().setDescription("You can't kick yourself.")],
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
    if (!member.kickable)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot kick **${member.user.username}**.`
          ),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been kicked from ${interaction.guild.name}.`)
            .setFields(
              {
                name: "Kicked by",
                value: `${interaction.member} (${interaction.member.id})`,
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
                inline: true,
              }
            ),
        ],
      })
      .catch(() => null);

    member.kick(reason);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been kicked from this server.`
        ),
      ],
      ephemeral: true,
    });
  },
});
