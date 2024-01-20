import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to unban.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async ({ interaction }) => {
    if (!interaction.guild.members.me!.permissions.has("BanMembers"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "I cannot unban users in this server."
          ),
        ],
        ephemeral: true,
      });

    const id = interaction.options.getUser("user", true).id;

    const bans = await interaction.guild.bans.fetch();
    if (!bans.has(id))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The user ID specified is not banned in this server."
          ),
        ],
        ephemeral: true,
      });

    const user = await interaction.guild.members.unban(id);
    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `${
            user?.username ? `**${user.username}**` : "The user you specified"
          } has been unbanned from this server.`
        ),
      ],
      ephemeral: true,
    });
  },
});
