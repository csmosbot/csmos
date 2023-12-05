import { SlashCommand } from "@/structures/command.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms from "ms";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user from this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("length")
        .setDescription("The length of time this user will be muted for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why you are muting this user.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
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
        embeds: [new DangerEmbed().setDescription("You can't mute yourself.")],
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
            `I cannot mute **${member.user.username}**.`
          ),
        ],
        ephemeral: true,
      });
    if (member.isCommunicationDisabled())
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `**${member.user.username}** is already muted.`
          ),
        ],
        ephemeral: true,
      });

    const time = interaction.options.getString("length", true);
    if (!ms(time))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The mute length you specified is invalid."
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
            .setTitle(`❌ You have been muted from ${interaction.guild.name}.`)
            .setFields(
              {
                name: "Muted by",
                value: `${interaction.member} (${interaction.member.id})`,
                inline: true,
              },
              {
                name: "Length",
                value: ms(ms(time), { long: true }),
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

    member.timeout(ms(time), reason);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been muted from this server.`
        ),
      ],
      ephemeral: true,
    });
  },
});
