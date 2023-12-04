import type { ColorResolvable } from "discord.js";
import { existsSync, readFileSync } from "fs";
import { parse } from "yaml";

interface Config {
  prefix: string;
  guildId: string;
  colors: Record<"primary" | "success" | "danger", ColorResolvable>;
  emotes: Record<"previous" | "next", string> & {
    player: Record<
      | "previous"
      | "pause"
      | "play"
      | "next"
      | "stop"
      | "shuffle"
      | "forward"
      | "rewind",
      string
    > & {
      loop: Record<"default" | "single", string>;
    };
  };
}

const loadConfig = (): Config => {
  let config: string;

  if (existsSync("./config.yml")) config = readFileSync("./config.yml", "utf8");
  else if (existsSync("./config.yaml"))
    config = readFileSync("./config.yaml", "utf8");
  else throw new SyntaxError("No configuration file found");

  return parse(config) as Config;
};

export const config = loadConfig();
