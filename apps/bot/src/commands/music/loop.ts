import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { formatRepeatMode } from "@/utils/player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { RepeatMode } from "distube";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Set the loop mode for the queue in this server.")
    .addNumberOption((option) =>
      option
        .setName("mode")
        .setDescription("The new loop mode.")
        .setChoices(
          {
            name: "Off",
            value: RepeatMode.DISABLED,
          },
          {
            name: "Song",
            value: RepeatMode.SONG,
          },
          {
            name: "Queue",
            value: RepeatMode.QUEUE,
          }
        )
        .setRequired(false)
    ),
  run: ({ client, interaction }) => {
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

    const loop = interaction.options.getNumber("mode") ?? undefined;

    const repeat = queue.setRepeatMode(loop);
    const newRepeat = formatRepeatMode(repeat);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          newRepeat?.length
            ? `Set loop mode to: ${newRepeat}.`
            : "Disabled loop."
        ),
      ],
      ephemeral: true,
    });
  },
});
