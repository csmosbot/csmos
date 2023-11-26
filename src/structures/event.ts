import { ClientEvents } from "discord.js";
import { BotClient } from "./client.js";

export interface EventOptions<E extends keyof ClientEvents> {
  name: E;
  run: (client: BotClient<true>, ...args: ClientEvents[E]) => any;
}

export class Event<E extends keyof ClientEvents> {
  constructor(options: EventOptions<E>) {
    Object.assign(this, options);
  }
}
