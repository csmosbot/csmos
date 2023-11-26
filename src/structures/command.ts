import { Message, PermissionResolvable } from "discord.js";
import { BotClient } from "./client.js";

export interface CommandOptions {
  name: string;
  description?: string;
  aliases?: string[];
  userPermissions?: PermissionResolvable[];
  run: ({
    client,
    message,
    args,
  }: {
    client: BotClient<true>;
    message: Message;
    args: string[];
  }) => any;
}

export class Command {
  constructor(options: CommandOptions) {
    Object.assign(this, options);
  }
}
