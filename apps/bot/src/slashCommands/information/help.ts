import { SlashCommand } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { getPrefix } from "@/utils/prefix";
import {
  PermissionsBitField,
  SlashCommandBuilder,
  type APIEmbedField,
} from "discord.js";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);
const emojis = {
  configuration: "⚙️",
  moderation: "⚒️",
  music: "🎵",
  information: "ℹ️",
} as const;

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View information about all my commands.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command you want to view the information of.")
        .setRequired(false)
        .setAutocomplete(true)
    ),
  autocomplete: async ({ client, interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = client.commands
      .map((command) => command.name)
      .sort(sortAlphabetically);
    const filtered = choices
      .filter((choice) => choice.startsWith(focusedValue))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  run: ({ client, interaction }) => {
    const cmd = interaction.options.getString("command")?.toLowerCase();
    if (cmd) {
      const command =
        client.commands.get(cmd) ||
        client.commands.find((c) => c.aliases?.includes(cmd));
      if (!command)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The command you specified was invalid."
            ),
          ],
          ephemeral: true,
        });

      const embed = new Embed().setTitle(
        `${getPrefix(client, interaction.guild.id)}${command.name}`
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
          value: `${getPrefix(client, interaction.guild.id)}${command.usage}`,
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

      interaction.reply({
        embeds: [embed],
        ephemeral: true,
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

      interaction.reply({
        embeds: [
          new Embed()
            .setTitle("🚀 Need some help blasting off?")
            .setDescription(
              "Here is a list of all my commands, along with their respective category. I will always be here to help!"
            )
            .setFields(fields),
        ],
        ephemeral: true,
      });
    }
  },
});
