import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the current song."),
  run: async ({ client, interaction }) => {
    if (await featureIsDisabled(interaction.guild.id, "music"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The music system is disabled in this server."
          ),
        ],
        ephemeral: true,
      });

    const { channel } = interaction.member.voice;
    const me = interaction.guild.members.me!;

    if (!channel)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "You need to be in a voice channel."
          ),
        ],
        ephemeral: true,
      });
    if (me.voice.channel && me.voice.channel.id !== channel.id)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription("I am in another voice channel."),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Show me!")
              .setURL(
                `https://discord.com/channels/${interaction.guild.id}/${me.voice.channel.id}`
              )
          ),
        ],
        ephemeral: true,
      });
    if (!channel.members.has(me.id) && channel.userLimit !== 0 && channel.full)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription("Your voice channel is full."),
        ],
        ephemeral: true,
      });
    if (!channel.permissionsFor(me).has("Connect"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "I do not have permission to connect to your voice channel."
          ),
        ],
        ephemeral: true,
      });
    if (!channel.permissionsFor(me).has("Speak"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "I do not have permission to speak to your voice channel."
          ),
        ],
        ephemeral: true,
      });

    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue || !queue.songs || queue.songs.length === 0)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "No music is being played in this server."
          ),
        ],
        ephemeral: true,
      });
    if (!queue.paused)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The current song is not paused. Try using `/pause` instead."
          ),
        ],
        ephemeral: true,
      });

    queue.resume();
    interaction.reply({
      embeds: [new SuccessEmbed().setDescription("Resumed the current song.")],
      ephemeral: true,
    });
  },
});
