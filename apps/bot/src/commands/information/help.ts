import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed, Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import { PermissionsBitField, type APIEmbedField } from "discord.js";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);
const emojis = {
  configuration: "⚙️",
  moderation: "⚒️",
  music: "🎵",
  information: "ℹ️",
} as const;

export default new Command({
  name: "help",
  description: "View information about all my commands.",
  usage: "help <command>",
  run: ({ client, message, args }) => {
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

      const embed = new Embed().setTitle(
        `${getPrefix(client, message.guild.id)}${command.name}`
      );

      if (command.description) embed.setDescription(command.description);
      if (command.aliases)
        embed.addFields({
          name: "Aliases",
          value: command.aliases
            .sort(sortAlphabetically)
            .map((alias) => `\`${alias}\``)
            .join(", "),
        });
      if (command.usage)
        embed.addFields({
          name: "Usage",
          value: `${
            client.db.guilds.get(message.guild.id, "prefix") ?? config.prefix
          }${command.usage}`,
        });
      if (command.userPermissions)
        embed.addFields({
          name: "Required permissions",
          value: new PermissionsBitField(command.userPermissions)
            .toArray()
            .sort(sortAlphabetically)
            .map((x) => `\`${x}\``)
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
