import { SlashCommand } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { db } from "@csmos/db";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
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
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    const data = await db.afk.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });

    switch (subcommand) {
      case "set":
        {
          if (data)
            return interaction.reply({
              embeds: [
                new DangerEmbed().setDescription(
                  `You are already AFK. Try using \`${await getPrefix(
                    client,
                    interaction.guild.id
                  )}afk reset\` instead.`
                ),
              ],
              ephemeral: true,
            });

          const reason = interaction.options.getString("reason");

          await db.afk.create({
            data: {
              userId: interaction.user.id,
              reason,
            },
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
                  `You are not currently AFK. Try using \`${await getPrefix(
                    client,
                    interaction.guild.id
                  )}afk <reason>\` instead.`
                ),
              ],
              ephemeral: true,
            });

          await db.afk.delete({
            where: {
              id: data.id,
            },
          });

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