import type { ExtendedInteraction } from "@/structures/command.js";
import { Event } from "@/structures/event.js";
import { config } from "@/utils/config.js";
import { EmbedBuilder } from "discord.js";

export default new Event({
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isCommand()) {
      if (!interaction.inGuild())
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("My commands can only be used in a server.")
              .setColor(config.colors.danger),
          ],
        });

      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.run({
          client,
          interaction: interaction as ExtendedInteraction,
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
});
