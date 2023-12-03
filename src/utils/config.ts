import type { ColorResolvable } from "discord.js";
import { readFileSync } from "fs";

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

export const config = JSON.parse(
  readFileSync("./config.json", "utf8")
) as Config;
