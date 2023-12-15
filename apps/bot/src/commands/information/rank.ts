import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { calculateLevelXp } from "@/utils/leveling";
import { getUser, getUsers } from "@csmos/db";
import { Rank } from "@nottca/canvacord";
import { AttachmentBuilder } from "discord.js";
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
  name: "rank",
  description: "View a user's current level and XP.",
  aliases: ["xp", "level"],
  usage: ["rank", "rank <user>"],
  examples: [
    {
      description: "view your own rank",
    },
    {
      example: "rank @ToastedToast",
      description: "view @ToastedToast's rank",
    },
  ],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const data = await getUser(member.id, message.guild.id);
    const rank =
      (await getUsers(message.guild.id))
        .sort(
          (a, z) =>
            calculateLevelXp(z.level) +
            z.xp -
            (calculateLevelXp(a.level) + a.xp)
        )
        .findIndex((u) => u.id === member.id) || 1;

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

    message.channel.send({
      files: [
        new AttachmentBuilder(image, {
          name: `${member.id}-rankcard.png`,
        }),
      ],
    });
  },
});
