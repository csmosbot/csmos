import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why you are banning this user.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "moderation"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The moderation system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

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
        embeds: [new DangerEmbed().setDescription("You can't ban yourself.")],
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
    if (!member.bannable)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ban **${member.user.username}**.`
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
            .setTitle(`❌ You have been banned from ${interaction.guild.name}.`)
            .setFields(
              {
                name: "Banned by",
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
          `**${member.user.username}** has been banned from this server.`
        ),
      ],
      ephemeral: true,
    });
  },
});
