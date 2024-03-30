import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Add or remove roles from a user.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add the role to.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role from a user.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove the role from.")
            .setRequired(false)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
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

    const subcommand = interaction.options.getSubcommand();

    const role = interaction.options.getRole("role", true);
    if (!role)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `Role to be ${subcommand}ed must be specified.`
          ),
        ],
        ephemeral: true,
      });
    if (
      role.managed ||
      role.position >= interaction.guild.members.me!.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ${subcommand} **${role.name}** ${
              subcommand === "add" ? "to" : "from"
            } users.`
          ),
        ],
        ephemeral: true,
      });

    const member = interaction.options.getMember("user") || interaction.member;
    if (
      member.id !== interaction.member.id &&
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
    if (!member.manageable)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            `I cannot ${
              subcommand === "add" ? "add roles to" : "remove roles from"
            } **${member.user.username}**.`
          ),
        ],
        ephemeral: true,
      });

    await member.fetch();

    switch (subcommand) {
      case "add":
        {
          if (member.roles.cache.has(role.id))
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `**${member.user.username}** already has the role **${role.name}**.`
                ),
              ],
              ephemeral: true,
            });
          await member.roles.add(role);
        }
        break;
      case "remove":
        {
          if (!member.roles.cache.has(role.id))
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `**${member.user.username}** does not have the role **${role.name}**.`
                ),
              ],
              ephemeral: true,
            });
          await member.roles.remove(role);
        }
        break;
    }

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `**${role.name}** has been ${
            subcommand === "add" ? "added to" : "removed from"
          } **${member.user.username}**.`
        ),
      ],
      ephemeral: true,
    });
  },
});
