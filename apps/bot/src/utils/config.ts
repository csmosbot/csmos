import type { ColorResolvable, PresenceStatus } from "discord.js";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { parse } from "yaml";

interface Config {
  guildID: string | false;
  colors: Record<"primary" | "success" | "danger", ColorResolvable>;
  emotes: {
    previous: string;
    next: string;
    statuses: Record<PresenceStatus, string>;
    badges: Record<
      | "activeDeveloper"
      | "bugHunterLevel1"
      | "bugHunterLevel2"
      | "discordPartner"
      | "discordStaff"
      | "earlySupporter"
      | "hypeSquadBalance"
      | "hypeSquadBravery"
      | "hypeSquadBrilliance"
      | "hypeSquadEvents"
      | "moderatorProgramAlumni"
      | "nitro"
      | "serverBooster"
      | "verifiedDeveloper",
      string
    >;
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
  const join = (...paths: string[]) => path.join(process.cwd(), ...paths);

  if (existsSync(join("../../../../config.yml")))
    config = readFileSync(join("../../../../config.yml"), "utf8");
  else if (existsSync(join("../../../../config.yaml")))
    config = readFileSync(join("../../../../config.yaml"), "utf8");
  else throw new SyntaxError("No configuration file found");

  return parse(config) as Config;
};

export const config = loadConfig();
