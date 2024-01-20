import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import ms from "ms";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("rewind")
    .setDescription("Goes backwards in the current song")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of time to skip forward to.")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
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

    let seekNumber = parseInt(interaction.options.getString("time", true));
    if (isNaN(seekNumber))
      seekNumber = ms(interaction.options.getString("time", true));
    if (isNaN(seekNumber))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of time to rewind to must be a number."
          ),
        ],
        ephemeral: true,
      });

    const seekTime = queue.currentTime - seekNumber;
    if (seekTime < 0 || seekTime >= queue.songs[0].duration - queue.currentTime)
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of time to rewind to must be greater than the beginning of the current song."
          ),
        ],
        ephemeral: true,
      });

    queue.seek(seekTime);

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription(
          `Rewinded to **${queue.formattedCurrentTime}**.`
        ),
      ],
      ephemeral: true,
    });
  },
});
