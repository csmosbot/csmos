import fs from "fs";
import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";
import { PermissionFlagsBits, ChannelType } from "discord-api-types/v10";
import { RepeatMode } from "distube";
import superjson from "superjson";
import prettier from "@prettier/sync";

const permissions = {
  AddReactions: "Add Reactions",
  Administrator: "Administrator",
  AttachFiles: "Attach Files",
  BanMembers: "Ban Members",
  ChangeNickname: "Change Nickname",
  Connect: "Connect",
  CreateEvents: "Create Events",
  CreateGuildExpressions: "Create Expressions",
  CreateInstantInvite: "Create Invite",
  CreatePrivateThreads: "Create Private Threads",
  CreatePublicThreads: "Create Public Threads",
  DeafenMembers: "Deafen Members",
  EmbedLinks: "Embed Links",
  KickMembers: "Kick Members",
  ManageChannels: "Manage Channels",
  ManageEmojisAndStickers: "Manage Expressions",
  ManageEvents: "Manage Events",
  ManageGuild: "Manage Server",
  ManageGuildExpressions: "Manage Expressions",
  ManageMessages: "Manage Messages",
  ManageNicknames: "Manage Nicknames",
  ManageRoles: "Manage Roles",
  ManageThreads: "Manage Threads",
  MentionEveryone: "Mention @everyone, @here, and All Roles",
  ModerateMembers: "Moderate Members",
  MoveMembers: "Move Members",
  MuteMembers: "Mute Members",
  PrioritySpeaker: "Priority Speaker",
  ReadMessageHistory: "Read Message History",
  RequestToSpeak: "Request to Speak",
  SendMessages: "Send Messages",
  SendMessagesInThreads: "Send Messges in Threads",
  SendTTSMessages: "Send Text-to-Speech Messages",
  SendVoiceMessages: "Send Voice Messages",
  Speak: "Speak",
  Stream: "Video",
  UseApplicationCommands: "Use Application Commands",
  UseEmbeddedActivities: "Use Activities",
  UseExternalEmojis: "Use External Emojis",
  UseExternalSounds: "Use External Sounds",
  UseExternalStickers: "Use External Stickers",
  UseSoundboard: "Use Soundboard",
  UseVAD: "Use Voice Activity",
  ViewAuditLog: "View Audit Log",
  ViewChannel: "View Channel",
  ViewCreatorMonetizationAnalytics: "View Creator Monetization Analytics",
  ViewGuildInsights: "View Server Insights",
};

function capitalize(str) {
  const arr = str.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

const convertOptions = (options) =>
  options.map((option) => ({
    name: option.name,
    description: option.description,
    required: option.required,
  }));

async function main() {
  let registry = [];

  const categories = fs.readdirSync("./apps/bot/src/commands");
  for (const category of categories) {
    const entries = [];
    const commandFiles = fs
      .readdirSync(`./apps/bot/src/commands/${category}`)
      .filter((file) => file.endsWith("js") || file.endsWith("ts"));
    for (const file of commandFiles) {
      const command = fs.readFileSync(
        `./apps/bot/src/commands/${category}/${file}`,
        "utf8"
      );
      const [rawCode] = command.match(/(?<=(new Command\()){[\s\S]*}/g);
      const code = rawCode
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":')
        .split("\n");
      const runIndex = code.findIndex((str) => str.includes("run"));
      const data = eval(
        // injected modules
        `${SlashCommandBuilder}\n` +
          `const PermissionFlagsBits = ${superjson.stringify(PermissionFlagsBits)}.json\n` +
          `const ChannelType = ${superjson.stringify(ChannelType)}.json\n` +
          `const RepeatMode = ${superjson.stringify(RepeatMode)}.json\n` +
          'const featuresEnum = { enumName: "featuresEnum", enumValues: [] }\n' +
          "var data = " +
          code.slice(0, runIndex).join("\n").replace(/,\s*$/, "") +
          "\n}" +
          "\ndata.data.toJSON();"
      );

      const entry = {
        name: data.name,
        description: data.description,
      };

      if (data.options?.length) {
        const { options } = data;
        if (options[0]?.type === 1 || options[0]?.type === 2) {
          entry.subcommands = options.map((option) => {
            if (option.type === 1)
              return {
                name: option.name,
                description: option.description,
                options: convertOptions(option.options),
              };
            else
              return {
                name: option.name,
                description: option.description,
                subcommands: option.options.map((subcommand) => ({
                  name: subcommand.name,
                  description: subcommand.description,
                  options:
                    subcommand.options &&
                    !!subcommand.options.length &&
                    convertOptions(subcommand.options),
                })),
              };
          });
        } else entry.options = convertOptions(options);
      }

      if (data.default_member_permissions) {
        entry.permissions = new PermissionsBitField(
          data.default_member_permissions
        )
          .toArray()
          .map((p) => permissions[p]);
      }

      entries.push(entry);
    }

    registry.push({
      name: capitalize(category),
      commands: entries.sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  registry = registry.sort((a, b) => a.name.localeCompare(b.name));

  // fs.writeFileSync(
  //   "./apps/web/command-categories.mjs",
  //   [
  //     "/* DO NOT EDIT THIS FILE. This is automatically generated by the script in `scripts/docgen/commands.js`. To add a new category, create a new folder in `apps/bot/src/commands`. */",
  //     "/* eslint-disable */",
  //     "",
  //     `export const categories = ${JSON.stringify(
  //       categories
  //         .map((category) => ({
  //           label: capitalize(category.replace("-", " ")),
  //           collapsed: true,
  //           autogenerate: {
  //             directory: `commands/${category}`,
  //           },
  //         }))
  //         .sort((a, b) => a.label.localeCompare(b)),
  //       null,
  //       2
  //     )};`,
  //   ].join("\n")
  // );

  fs.writeFileSync(
    "./apps/web/src/registry/registry.json",
    [
      prettier.format(
        JSON.stringify([
          {
            NOTE: "This file is autogenerated by tooling/scripts/docgen/commands.js. Do not edit this file directly.",
          },
          ...registry,
        ]),
        { filepath: "./apps/web/src/registry/registry.json" }
      ),
    ].join("\n")
  );
}

main();
