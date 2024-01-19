import { SlashCommand } from "@/structures/command";
import { config } from "@/utils/config";
import { Embed } from "@/utils/embed";
import type { Activity } from "discord.js";
import { ActivityType, SlashCommandBuilder, UserFlags, time } from "discord.js";

const statuses = {
  online: `${config.emotes.statuses.online} Online`,
  idle: `${config.emotes.statuses.idle} Idle`,
  dnd: `${config.emotes.statuses.dnd} Do Not Disturb`,
  invisible: `${config.emotes.statuses.offline} Offline`,
  offline: `${config.emotes.statuses.offline} Offline`,
};

const activities = {
  [ActivityType.Playing]: "Playing",
  [ActivityType.Streaming]: "Streaming",
  [ActivityType.Listening]: "Listening to",
  [ActivityType.Watching]: "Watching",
  [ActivityType.Custom]: "",
  [ActivityType.Competing]: "Competing",
};

// simple flags util
const Flags = Object.keys(UserFlags).reduce(
  (acc, curr) => {
    // @ts-expect-error enums have an extra [x: number]: number type for some reason
    acc[curr] = curr;
    return acc;
  },
  {} as {
    [K in keyof typeof UserFlags]: K;
  }
);

const badges = {
  [Flags.ActiveDeveloper]: config.emotes.badges.activeDeveloper,
  [Flags.BugHunterLevel1]: config.emotes.badges.bugHunterLevel1,
  [Flags.BugHunterLevel2]: config.emotes.badges.bugHunterLevel2,
  [Flags.CertifiedModerator]: config.emotes.badges.moderatorProgramAlumni,
  [Flags.HypeSquadOnlineHouse1]: config.emotes.badges.hypeSquadBravery,
  [Flags.HypeSquadOnlineHouse2]: config.emotes.badges.hypeSquadBrilliance,
  [Flags.HypeSquadOnlineHouse3]: config.emotes.badges.hypeSquadBalance,
  [Flags.Hypesquad]: config.emotes.badges.hypeSquadEvents,
  [Flags.Partner]: config.emotes.badges.discordPartner,
  [Flags.PremiumEarlySupporter]: config.emotes.badges.earlySupporter,
  [Flags.Staff]: config.emotes.badges.discordStaff,
  [Flags.VerifiedDeveloper]: config.emotes.badges.verifiedDeveloper,
};

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("View information about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to view the information of.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const member = interaction.options.getMember("user") ?? interaction.member;

    const activity = member.presence
      ? member.presence.activities[0]
      : ({
          type: ActivityType.Custom,
          state: "None",
        } as Activity);

    let userStatus = "No activity";
    if (activity) {
      if (activity.type === ActivityType.Custom) {
        const emoji = `${
          activity.emoji
            ? activity.emoji?.id
              ? `<${activity.emoji?.animated ? "a" : ""}:${
                  activity.emoji?.name
                }:${activity.emoji?.id}>`
              : activity.emoji?.name
            : ""
        }`;
        userStatus = `${emoji} \`${activity.state || "No activity"}\``;
      } else {
        userStatus = `\`${activities[activity.type]} ${activity.name}\``;
      }
    }

    const userFlags = (await member.user.fetchFlags()).toArray();

    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .addFields(
            {
              name: "ID",
              value: member.user.id,
              inline: true,
            },
            {
              name: "Bot",
              value: member.user.bot ? "✅" : "❌",
              inline: true,
            },
            {
              name: "Avatar",
              value: `[Download](${member.user
                .displayAvatarURL({
                  size: 4096,
                })
                .replace("webp", "png")})`,
              inline: true,
            },
            {
              name: "Joined",
              value: time(member.joinedAt!, "f"),
              inline: true,
            },
            {
              name: "Registered",
              value: time(member.user.createdAt, "f"),
              inline: true,
            },
            {
              name: "Badges",
              value: userFlags
                .map((badge) => badges[badge as keyof typeof badges])
                .join(" "),
            },
            {
              name: "Status",
              value: statuses[member.presence?.status ?? "offline"],
              inline: true,
            },
            {
              name: "Activity",
              value: userStatus,
              inline: true,
            }
          ),
      ],
    });
  },
});
