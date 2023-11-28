import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
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

export interface ExtendedInteraction
  extends ChatInputCommandInteraction<"cached"> {
  member: GuildMember;
}

export interface SlashCommandOptions {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<this, "addSubcommand" | "addSubcommandGroup">;
  run: ({
    client,
    interaction,
  }: {
    client: BotClient<true>;
    interaction: ExtendedInteraction;
  }) => any;
}

export class SlashCommand {
  constructor(options: SlashCommandOptions) {
    Object.assign(this, options);
  }
}
