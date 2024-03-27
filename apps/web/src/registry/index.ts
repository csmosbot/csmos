import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export interface RegistryEntry {
  name: string;
  commands: Command[];
}

export type Command = {
  name: string;
  description: string;
  permissions?: string[];
} & ({ options: Option[] } | { subcommands: Subcommand[] });

export interface Option {
  name: string;
  description: string;
  required: boolean;
}

export type Subcommand = SubcommandWithOptions | SubcommandWithChildren;

export type SubcommandWithOptions = {
  name: string;
  description: string;
  options: Option[];
};

export type SubcommandWithChildren = {
  name: string;
  description: string;
  subcommands: Subcommand[];
};

const readRegistry = () =>
  readFile(
    join(dirname(fileURLToPath(import.meta.url)), "./registry.json"),
    "utf8"
  ).then((text) => JSON.parse(text));

export async function getRegistry(): Promise<RegistryEntry[]> {
  const registry = await readRegistry();
  return registry.filter((x: any) => !x.NOTE);
}
