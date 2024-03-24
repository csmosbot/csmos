import type { ExtendedInteraction } from "@/structures/command";
import { event } from "@/structures/event";
import { config } from "@/utils/config";
import { EmbedBuilder } from "discord.js";

export default event("interactionCreate", async (client, interaction) => {
  if (interaction.isCommand()) {
    if (!interaction.inGuild())
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("My commands can only be used in a server.")
            .setColor(config.colors.danger),
        ],
      });

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run({
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (err) {
      console.error(err);
    }
  } else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.autocomplete?.({ client, interaction });
    } catch (err) {
      console.error(err);
    }
  }
});
