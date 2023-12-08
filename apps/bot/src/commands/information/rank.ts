import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { calculateLevelXp } from "@/utils/leveling";
import { db } from "@csmos/db";
import { Rank } from "@nottca/canvacord";
import { AttachmentBuilder } from "discord.js";

const statuses = {
  online: "online",
  idle: "idle",
  dnd: "dnd",
  invisible: "invisible",
  offline: "invisible",
} as const;

export default new Command({
  name: "rank",
  description: "View someone's current level and XP.",
  usage: "rank [user]",
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const data = await db.user.upsert({
      where: {
        id: member.id,
        guildId: message.guild.id,
      },
      create: {
        id: member.id,
        guildId: message.guild.id,
      },
      update: {},
    });
    const rank = (
      await db.user.findMany({
        where: {
          guildId: message.guild.id,
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

    message.channel.send({
      files: [
        new AttachmentBuilder(image, {
          name: `${member.id}-rankcard.png`,
        }),
      ],
    });
  },
});
