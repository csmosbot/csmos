import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

interface RegistryEntry {
  name: string;
  commands: Command[];
}

type Command = {
  name: string;
  description: string;
} & ({ options: Option[] } | { subcommands: Subcommand[] });

interface Option {
  name: string;
  description: string;
  required: boolean;
}

type Subcommand = {
  name: string;
  description: string;
} & ({ options: Option[] } | { subcommands: Subcommand[] });

const readRegistry = () =>
  readFile(
    join(dirname(fileURLToPath(import.meta.url)), "./registry.json"),
    "utf8"
  ).then((text) => JSON.parse(text));

export async function getRegistry(): Promise<RegistryEntry[]> {
  const registry = await readRegistry();
  return registry.filter((x: any) => !x.NOTE);
}
