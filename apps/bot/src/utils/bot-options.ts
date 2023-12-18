import type { ClientOptions } from "discord.js";
import { ActivityType, GatewayIntentBits } from "discord.js";

export const botOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
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
