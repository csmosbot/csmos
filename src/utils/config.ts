import { ColorResolvable } from "discord.js";
import { readFileSync } from "fs";

interface Config {
  prefix: string;
  // guildId: string;
  colors: Record<"primary" | "success" | "danger", ColorResolvable>;
}

export const config = JSON.parse(
  readFileSync("./config.json", "utf8")
) as Config;
