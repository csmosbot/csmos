import fs from "fs";
import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField } from "discord.js";
import { PermissionFlagsBits, ChannelType } from "discord-api-types/v10";
import { RepeatMode } from "distube";
import superjson from "superjson";
import { markdownTable } from "markdown-table";

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

const usage = (command) => {
  if (
    command.options &&
    (command.options[0]?.type === 1 || command.options[0]?.type === 2)
  )
    return command.options
      .filter((option) => option.type === 1 || option.type === 2)
      .map((option) => {
        if (option.type === 2)
          return option.options.map(
            (subcommand) => `/${command.name} ${option.name} ${subcommand.name}`
          );
        return `/${command.name} ${option.name}`;
      })
      .join("\n");

  return `/${command.name}`;
};

const convertOptionsToMd = (options, hashLevel = 1) => {
  const markdown = [];
  if (options[0]?.type === 1 || options[0]?.type === 2) {
    markdown.push(
      `${Array(hashLevel + 1)
        .fill("#")
        .join("")} Subcommands`
    );
    markdown.push(
      ...options.map((option) => {
        if (option.type === 1)
          return `\n${Array(hashLevel + 2)
            .fill("#")
            .join(
              ""
            )} ${option.name}\n\n${option.description}${option.options.length ? "\n\n" + convertOptionsToMd(option.options, 3) : ""}`;
        else if (option.type === 2)
          return `\n${Array(hashLevel + 2)
            .fill("#")
            .join("")} ${option.name}\n${option.options.map(
            (option) =>
              `\n${Array(hashLevel + 3)
                .fill("#")
                .join(
                  ""
                )} ${option.name}\n\n${option.description}${option.options.length ? "\n\n" + convertOptionsToMd(option.options, 4) : ""}\n`
          )}`;
      })
    );
  } else {
    markdown.push(
      `${Array(hashLevel + 1)
        .fill("#")
        .join("")} Options\n`
    );
    markdown.push(
      markdownTable(
        [
          ["Name", "Description", "Required"],
          ...options.map((option) => [
            `\`${option.name}\``,
            option.description,
            option.required ? "Yes" : "No",
          ]),
        ],
        { align: ["c", "c", "c"] }
      )
    );
  }
  return markdown.join("\n");
};

async function main() {
  const categories = fs.readdirSync("./apps/bot/src/commands");
  for (const category of categories) {
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
          "var data = " +
          code.slice(0, runIndex).join("\n").replace(/,\s*$/, "") +
          "\n}" +
          "\ndata.data.toJSON();"
      );
      const markdown = [
        "---",
        `# DO NOT EDIT THIS FILE. This is automatically generated by the script in \`scripts/docgen/commands.mjs\`. To update these contents, update the information in \`apps/bot/src/commands/${category}/${file}\`.\n`,
        `title: ${!isNaN(data.name) ? `"${data.name}"` : data.name}`,
        `description: ${data.description}`,
        `editUrl: https://github.com/CosmoticLabs/csmos/edit/main/apps/bot/src/commands/${category}/${file}`,
        "tableOfContents:",
        "  maxHeadingLevel: 5",
        "---\n",
        data.description,
        "\n## Usage",
        "\n```sh",
        usage(data),
        "```",
        data.options?.length
          ? "\n" + convertOptionsToMd(data.options)
          : undefined,
        data.default_member_permissions
          ? [
              "\n## Required Permissions",
              "\n:::note",
              "Learn more about permissions in [Discord's FAQ](https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ).",
              ":::\n",
              ...new PermissionsBitField(data.default_member_permissions)
                .toArray()
                .map((p) => `- ${permissions[p]}`),
            ].join("\n")
          : undefined,
      ]
        .filter(Boolean)
        .join("\n");

      if (!fs.existsSync(`./apps/web/src/content/docs/commands/${category}`))
        fs.mkdirSync(`./apps/web/src/content/docs/commands/${category}`);
      fs.writeFileSync(
        `./apps/web/src/content/docs/commands/${category}/${
          file.split(".")[0]
        }.md`,
        markdown
      );
    }
  }

  fs.writeFileSync(
    "./apps/web/command-categories.mjs",
    [
      "/* DO NOT EDIT THIS FILE. This is automatically generated by the script in `scripts/docgen/commands.mjs`. To add a new category, create a new folder in `apps/bot/src/commands`. */",
      "/* eslint-disable */",
      "",
      `export const categories = ${JSON.stringify(
        categories.map((category) => ({
          label: capitalize(category.replace("-", " ")),
          collapsed: true,
          autogenerate: {
            directory: `commands/${category}`,
          },
        })),
        null,
        2
      )};`,
    ].join("\n")
  );
}

main();
