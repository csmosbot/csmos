import { Command } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { calculateLevelXp } from "@/utils/leveling.js";
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
  run: async ({ client, message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member!;

    client.db.users.ensure(member.id, {
      xp: 0,
      level: 0,
    });

    const data = client.db.users.get(member.id);
    const rank =
      client.db.users
        .keyArray()
        .map((user) => ({ id: user, ...client.db.users.get(user) }))
        .sort((a, z) => z.xp - a.xp)
        .findIndex((u) => u.id === member.id)! + 1;

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
