import { botOptions } from "@/utils/bot-options.js";
import { env } from "@/utils/env.js";
import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { CommandOptions } from "./command.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  commands = new Collection<string, CommandOptions>();

  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(env.TOKEN);
  }

  register() {
    const join = (...paths: string[]) => path.join(__dirname, ...paths);
    const convertToUrl = (path: string) => pathToFileURL(path).toString();

    // commands
    fs.readdirSync(join("../commands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(join("../commands", dir))
        .filter((file) => file.endsWith("js") || file.endsWith("ts"));

      for (const file of commandFiles) {
        const command = await import(
          convertToUrl(join("../commands", dir, file))
        )
          .then((x) => x?.default)
          .catch(() => null);
        if (!command || !command.name || !command.run) continue;

        this.commands.set(command.name, command);
      }
    });

    // events
    fs.readdirSync(join("../events"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const event = await import(convertToUrl(join("../events", file)))
          .then((x) => x?.default)
          .catch(() => null);
        if (!event || !event.name || !event.run) return;

        this.on(event.name, event.run.bind(null, this));
      });
  }
}
