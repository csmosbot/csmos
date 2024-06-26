import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { createAfk, deleteAfk, featureIsDisabled, getAfk } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set or remove your AFK status.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your AFK status.")
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Why you are going AFK.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remove").setDescription("Remove your AFK status.")
    ),
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "afk"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The AFK system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const subcommand = interaction.options.getSubcommand();
    const data = await getAfk(interaction.user.id, interaction.guild.id);

    switch (subcommand) {
      case "set":
        {
          if (data)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "You are already AFK. Try using `/afk reset` instead."
                ),
              ],
              ephemeral: true,
            });

          const reason = interaction.options.getString("reason");

          await createAfk({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            reason,
          });

          interaction.reply({
            embeds: [new SuccessEmbed().setDescription("You are now AFK.")],
            ephemeral: true,
          });
        }
        break;
      case "reset":
        {
          if (!data)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  "You are not currently AFK. Try using `/afk <reason>` instead."
                ),
              ],
              ephemeral: true,
            });

          await deleteAfk(data.id);

          interaction.reply({
            embeds: [
              new SuccessEmbed().setDescription(
                "Welcome back! I've removed your AFK."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
});
