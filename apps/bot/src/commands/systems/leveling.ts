import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { createUser, updateUser } from "@csmos/db";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Mee6LevelsApi from "mee6-levels-api";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("leveling")
    .setDescription("Configure the leveling system.")
    .addSubcommandGroup((group) =>
      group
        .setName("update")
        .setDescription("Update the leveling system.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("xp")
            .setDescription("Update the XP of a member.")
            .addUserOption((option) =>
              option
                .setName("member")
                .setDescription("The member to update the XP of.")
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option
                .setName("xp")
                .setDescription("The new XP value.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("level")
            .setDescription("Update the level of a member.")
            .addUserOption((option) =>
              option
                .setName("member")
                .setDescription("The member to update the level of.")
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option
                .setName("level")
                .setDescription("The new level.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("sync")
        .setDescription("Sync your levels from another bot.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("mee6")
            .setDescription("Sync your levels from MEE6.")
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    if (group === "update") {
      const member = interaction.options.getUser("member", true);
      switch (subcommand) {
        case "xp":
          {
            const xp = interaction.options.getNumber("xp", true);

            await updateUser(member.id, interaction.guild.id, {
              xp,
            });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Updated XP of **${member.username}**.`
                ),
              ],
              ephemeral: true,
            });
          }
          break;
        case "level":
          {
            const level = interaction.options.getNumber("level", true);

            await updateUser(member.id, interaction.guild.id, {
              level,
            });

            interaction.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Updated level of **${member.username}**.`
                ),
              ],
              ephemeral: true,
            });
          }
          break;
      }
    } else if (group === "sync") {
      switch (subcommand) {
        case "mee6": {
          await interaction.deferReply({
            ephemeral: true,
          });

          const users = await Mee6LevelsApi.getLeaderboard(
            interaction.guild.id
          );
          if (!users?.length)
            return interaction.followUp({
              embeds: [
                new DangerEmbed().setDescription(
                  "No users have leveled up with MEE6."
                ),
              ],
            });

          for (const user of users) {
            await createUser({
              id: user.id,
              guildId: interaction.guild.id,
              xp: user.xp.levelXp,
              level: user.level,
            });
          }

          interaction.followUp({
            embeds: [
              new SuccessEmbed().setDescription("Synced all users from MEE6."),
            ],
          });
        }
      }
    }
  },
});
