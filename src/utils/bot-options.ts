import { ActivityType, ClientOptions, GatewayIntentBits } from "discord.js";

export const botOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
  ],
  presence: {
    activities: [
      {
        name: "the solar system",
        type: ActivityType.Watching,
      },
    ],
  },
};
