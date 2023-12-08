import { SlashCommand } from "@/structures/command";
import { config } from "@/utils/config";
import { calculateLevelXp } from "@/utils/leveling";
import { db } from "@csmos/db";
import { Rank } from "@nottca/canvacord";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

const statuses = {
  online: "online",
  idle: "idle",
  dnd: "dnd",
  invisible: "invisible",
  offline: "invisible",
} as const;

export default new SlashCommand({
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
    const member = interaction.options.getMember("user") ?? interaction.member!;

    const data = await db.user.upsert({
      where: {
        id: member.id,
        guildId: interaction.guild.id,
      },
      create: {
        id: member.id,
        guildId: interaction.guild.id,
      },
      update: {},
    });
    const rank = (
      await db.user.findMany({
        where: {
          guildId: interaction.guild.id,
        },
      })
    )
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
      .setProgressBar(config.colors.primary as string, "COLOR");

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
