import { botOptions } from "@/utils/bot-options";
import { config } from "@/utils/config";
import { env } from "@/utils/env";
import { createPlayer } from "@/utils/player";
import { db } from "@csmos/db";
import type { ApplicationCommandDataResolvable } from "discord.js";
import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import type { CommandOptions, SlashCommandOptions } from "./command";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  commands = new Collection<string, CommandOptions & { category: string }>();
  slashCommands = new Collection<string, SlashCommandOptions>();
  maps = new Map();
  player = createPlayer(this);

  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(env.DISCORD_TOKEN);
  }

  register() {
    // create user
    this.on("messageCreate", async (message) => {
      if (
        !message.inGuild() ||
        message.author.bot ||
        (await db.user.findFirst({
          where: {
            id: message.author.id,
            guildId: message.guild.id,
          },
        }))
      )
        return;

      await db.user.create({
        data: {
          id: message.author.id,
          guildId: message.guild.id,
        },
      });
    });

    this.on("guildMemberAdd", async (member) => {
      if (
        await db.user.findFirst({
          where: {
            id: member.id,
            guildId: member.guild.id,
          },
        })
      )
        return;

      await db.user.create({
        data: {
          id: member.id,
          guildId: member.guild.id,
        },
      });
    });

    this.on("guildMemberRemove", async (member) => {
      if (
        !(await db.user.findFirst({
          where: {
            id: member.id,
            guildId: member.guild.id,
          },
        }))
      )
        return;

      await db.user.delete({
        where: {
          id: member.id,
          guildId: member.guild.id,
        },
      });
    });

    const join = (...paths: string[]) => path.join(__dirname, ...paths);

    // commands
    fs.readdirSync(join("../commands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(join("../commands", dir))
        .filter((file) => file.endsWith("js") || file.endsWith("ts"));

      for (const file of commandFiles) {
        const command = require(join("../commands", dir, file))?.default;
        if (!command || !command.name || !command.run) continue;

        this.commands.set(command.name, { ...command, category: dir });
      }
    });

    // slash commands
    const commands: ApplicationCommandDataResolvable[] = [];
    fs.readdirSync(join("../slashCommands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(join("../slashCommands", dir))
        .filter((file) => file.endsWith("js") || file.endsWith("ts"));

      for (const file of commandFiles) {
        const command = require(join("../slashCommands", dir, file))?.default;
        if (!command || !command.data || !command.run) return;

        commands.push(command.data.toJSON());
        this.slashCommands.set(command.data.toJSON().name, command);
      }
    });

    this.on("ready", async () => {
      if (config.guildID && typeof config.guildID === "string") {
        const guild = this.guilds.cache.get(config.guildID);
        if (!guild)
          throw new SyntaxError(`No guild exists with ID '${config.guildID}'`);

        await guild.commands.set(commands);
        console.log(`Registered commands in ${guild.name}.`);
      } else {
        await this.application?.commands.set(commands);
        console.log("Registered commands globally.");
      }
    });

    // events
    fs.readdirSync(join("../events"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const event = require(join("../events", file))?.default;
        if (!event || !event.name || !event.run) return;

        this.on(event.name, event.run.bind(null, this));
      });

    fs.readdirSync(join("../features"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const feature = require(join("../features", file))?.default;
        if (!feature) return;
        feature(this);
      });
  }
}
