import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { emojis, permissions } from "@/utils/help";
import { getPrefix } from "@/utils/prefix";
import { type APIEmbedField } from "discord.js";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);

export default new Command({
  name: "help",
  description: "View information about all of csmos' commands.",
  usage: ["help", "help <command>"],
  examples: [
    {
      example: "help",
      description: "view a list of all commands",
    },
    {
      example: "help play",
      description: "view information about the command 'play'",
    },
  ],
  run: async ({ client, message, args }) => {
    const cmd = args[0]?.toLowerCase();
    if (cmd) {
      const command =
        client.commands.get(cmd) ||
        client.commands.find((c) => c.aliases?.includes(cmd));
      if (!command)
        return message.channel.send({
          embeds: [
            new DangerEmbed().setDescription(
              "The command you specified was invalid."
            ),
          ],
        });

      const prefix = await getPrefix(client, message.guild.id);

      const embed = new Embed().setTitle(`${prefix}${command.name}`);

      if (command.description) embed.setDescription(command.description);
      if (command.usage)
        embed.addFields({
          name: "Usage",
          value:
            typeof command.usage === "string"
              ? `${prefix}${command.usage}`
              : command.usage.map((usage) => `${prefix}${usage}`).join("\n"),
        });

      if (command.examples)
        embed.addFields({
          name: "Examples",
          value: command.examples.map((example) => example.example).join("\n"),
        });
      if (command.aliases)
        embed.addFields({
          name: "Aliases",
          value: command.aliases
            .sort(sortAlphabetically)
            .map((alias) => `\`${alias}\``)
            .join(", "),
        });
      if (command.userPermissions)
        embed.addFields({
          name: "Required Permissions",
          value: command.userPermissions
            .sort(sortAlphabetically as any)
            .map((x) => `\`${permissions[x as keyof typeof permissions]}\``)
            .join(", "),
        });

      message.channel.send({
        embeds: [embed],
      });
    } else {
      const categories = [
        ...new Set(client.commands.map((cmd) => cmd.category)),
      ].sort(sortAlphabetically);
      const fields: APIEmbedField[] = [];

      for (const category of categories) {
        const commands = client.commands.filter(
          (cmd) => cmd.category === category
        );

        fields.push({
          name: `${emojis[category as keyof typeof emojis]} ${capitalize(
            category
          )}`,
          value: commands
            .map((command) => `\`${command.name}\``)
            .sort(sortAlphabetically)
            .join(", "),
        });
      }

      message.channel.send({
        embeds: [
          new Embed()
            .setTitle("🚀 Need some help blasting off?")
            .setDescription(
              "Here is a list of all my commands, along with their respective category. I will always be here to help!"
            )
            .setFields(fields),
        ],
      });
    }
  },
});
