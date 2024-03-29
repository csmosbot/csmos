import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed } from "@/utils/embed";
import { calculateLevelXp } from "@/utils/leveling";
import { getUser, getUsers, featureIsDisabled } from "@csmos/db";
import { Rank } from "@nottca/canvacord";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";

const statuses = {
  online: "online",
  idle: "idle",
  dnd: "dnd",
  invisible: "invisible",
  offline: "invisible",
} as const;

export default new Command({
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View someone's current level and XP.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to view the level and XP of.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "leveling"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The leveling system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const member = interaction.options.getMember("user") ?? interaction.member!;

    const data = await getUser(member.id, interaction.guild.id);
    const rank = (await getUsers(interaction.guild.id))
      .sort(
        (a, z) =>
          calculateLevelXp(z.level) + z.xp - (calculateLevelXp(a.level) + a.xp)
      )
      .findIndex((u) => u.id === member.id)!;

    const card = new Rank()
      .setUsername(member.displayName)
      .setDiscriminator(
        member.user.discriminator === "0"
          ? member.user.username
          : member.user.discriminator
      )
      .setAvatar(member.displayAvatarURL({ forceStatic: true }))
      .setCurrentXP(data.xp)
      .setRequiredXP(calculateLevelXp(data.level))
      .setLevel(data.level)
      .setRank(rank)
      .setStatus(statuses[member.presence!.status])
      .setProgressBar(config.colors.primary as string, "COLOR")
      .setProgressBarTrack("#820077")
      .setBackground(
        "IMAGE",
        readFileSync(join(__dirname, "../../../../../assets/rankcard.jpg"))
      );

    const image = await card.build();

    interaction.reply({
      files: [
        new AttachmentBuilder(image, {
          name: `${member.id}-rankcard.png`,
        }),
      ],
    });
  },
});
