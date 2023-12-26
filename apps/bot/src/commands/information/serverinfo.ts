import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { ChannelType, GuildPremiumTier, time } from "discord.js";

const boostTier = {
  [GuildPremiumTier.None]: "No Tier",
  [GuildPremiumTier.Tier1]: "Tier 1",
  [GuildPremiumTier.Tier2]: "Tier 2",
  [GuildPremiumTier.Tier3]: "Tier 3",
} as const;

export default new Command({
  name: "serverinfo",
  description: "Get information about a server.",
  examples: [
    {
      description: "get information about the server you're in",
    },
  ],
  run: async ({ message }) => {
    const { guild } = message;
    const owner = await guild.fetchOwner();

    return message.channel.send({
      embeds: [
        new Embed()
          .setAuthor({
            name: guild.name,
            iconURL: guild.iconURL() ?? undefined,
          })
          .addFields(
            {
              name: "Owner",
              value: `${owner} (${owner.user.username})`,
            },
            {
              name: "Created on",
              value: time(guild.createdAt, "f"),
            },
            {
              name: "All Channels",
              value: guild.channels.cache.size.toLocaleString(),
              inline: true,
            },
            {
              name: "Text Channels",
              value: guild.channels.cache
                .filter((c) =>
                  [
                    ChannelType.AnnouncementThread,
                    ChannelType.GuildAnnouncement,
                    ChannelType.GuildForum,
                    ChannelType.GuildText,
                    ChannelType.PrivateThread,
                    ChannelType.PublicThread,
                  ].includes(c.type)
                )
                .size.toLocaleString(),
              inline: true,
            },
            {
              name: "Voice Channels",
              value: guild.channels.cache
                .filter((c) =>
                  [
                    ChannelType.GuildStageVoice,
                    ChannelType.GuildVoice,
                  ].includes(c.type)
                )
                .size.toLocaleString(),
              inline: true,
            },
            {
              name: "Members",
              value: guild.memberCount.toLocaleString(),
              inline: true,
            },
            {
              name: "Humans",
              value: guild.members.cache
                .filter((member) => !member.user.bot)
                .size.toLocaleString(),
              inline: true,
            },
            {
              name: "Bots",
              value: guild.members.cache
                .filter((member) => member.user.bot)
                .size.toLocaleString(),
              inline: true,
            },
            {
              name: "Roles",
              value: guild.roles.cache.size.toLocaleString(),
              inline: true,
            },
            {
              name: "Boosts",
              value: `${(
                guild.premiumSubscriptionCount ?? 0
              ).toLocaleString()} (${boostTier[guild.premiumTier]})`,
              inline: true,
            }
          ),
      ],
    });
  },
});
