import type { ClientOptions } from "discord.js";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";

export const botOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.User,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.GuildScheduledEvent,
  ],
  presence: {
    activities: [
      {
        name: "the solar system",
        type: ActivityType.Watching,
      },
    ],
  },
  allowedMentions: {
    parse: [],
    roles: [],
    users: [],
    repliedUser: true,
  },
};
