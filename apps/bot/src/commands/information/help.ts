import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { emojis, permissions } from "@/utils/help";
import {
  SlashCommandBuilder,
  type APIEmbedField,
  PermissionsBitField,
} from "discord.js";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);

export default new Command({
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
      .map((command) => command.data.toJSON().name)
      .sort(sortAlphabetically);
    const filtered = choices
      .filter((choice) => choice.startsWith(focusedValue))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  run: async ({ client, interaction }) => {
    const cmd = interaction.options.getString("command")?.toLowerCase();
    if (cmd) {
      const command = client.commands.get(cmd);
      if (!command)
        return interaction.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "The command you specified was invalid."
            ),
          ],
          ephemeral: true,
        });

      const data = command.data.toJSON();
      const embed = new Embed().setTitle(`/${data.name}`);

      if (data.description) embed.setDescription(data.description);
      if (data.default_member_permissions)
        embed.addFields({
          name: "Required Permissions",
          value: new PermissionsBitField(data.default_member_permissions as any)
            .toArray()
            .sort(sortAlphabetically as any)
            .map((x) => `\`${permissions[x as keyof typeof permissions]}\``)
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
            .map((command) => `\`${command.data.toJSON().name}\``)
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
