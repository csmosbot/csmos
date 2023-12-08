import { SlashCommand } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { randomUUID } from "crypto";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user in this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why you are warning this user.")
        .setRequired(false)
    ),
  run: ({ client, interaction }) => {
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
        embeds: [new DangerEmbed().setDescription("You can't warn yourself.")],
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
            `I cannot warn **${member.user.username}**.`
          ),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    client.db.users.ensure(`${interaction.guild.id}-${member.id}`, {
      warnings: [],
    });

    client.db.users.push(
      `${interaction.guild.id}-${member.id}`,
      {
        id: randomUUID(),
        guildId: interaction.guild.id,
        moderatorId: interaction.member.id,
        reason,
        createdAt: Date.now(),
      },
      "warnings"
    );

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${member.user.username}** has been warned in this server.`
        ),
      ],
      ephemeral: true,
    });

    member
      .send({
        embeds: [
          new DangerEmbed()
            .setTitle(`❌ You have been warned in ${interaction.guild.name}.`)
            .setFields(
              {
                name: "Warned by",
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
  },
});
