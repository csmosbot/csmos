import type { ClientEvents } from "discord.js";
import type { BotClient } from "./client";

export function event<E extends keyof ClientEvents>(
  name: E,
  run: (client: BotClient<true>, ...args: ClientEvents[E]) => any
) {
  return {
    name,
    run,
  };
}
