import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { BotClient } from "./client";

export interface ExtendedInteraction
  extends ChatInputCommandInteraction<"cached"> {
  member: GuildMember;
  channel: GuildTextBasedChannel;
}

export interface CommandOptions {
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

export class Command {
  constructor(options: CommandOptions) {
    Object.assign(this, options);
  }
}
