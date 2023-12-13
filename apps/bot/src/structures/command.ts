import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { BotClient } from "./client";

export interface ExtendedMessage extends Message<true> {
  member: GuildMember;
}

export interface CommandOptions {
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string | string[];
  examples?: {
    example?: string;
    description: string;
  }[];
  userPermissions?: PermissionResolvable[];
  /**
   * @deprecated **NOT RECOMMENDED**, only used for custom permissions in the documentation. Use `userPermissions` instead.
   */
  permissions?: string[];
  run: ({
    client,
    message,
    args,
  }: {
    client: BotClient<true>;
    message: ExtendedMessage;
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
  channel: GuildTextBasedChannel;
}

export interface SlashCommandOptions {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  autocomplete?: ({
    client,
    interaction,
  }: {
    client: BotClient<true>;
    interaction: AutocompleteInteraction;
  }) => any;
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
