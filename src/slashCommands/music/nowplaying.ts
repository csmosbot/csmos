import { SlashCommand } from "@/structures/command.js";
import { DangerEmbed, Embed } from "@/utils/embed.js";
import { createBar } from "@/utils/player.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("View the currently playing song in this server."),
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

    const track = queue.songs[0];

    interaction.reply({
      embeds: [
        new Embed()
          .setAuthor({
            name: "Now playing",
            iconURL:
              "https://cdn.discordapp.com/emojis/994438540429643806.webp?size=160&quality=lossless",
          })
          .setTitle(track.name!)
          .setURL(track.url)
          .addFields(
            {
              name: "💡 Requested by",
              value: `>>> ${track.member}`,
              inline: true,
            },
            {
              name: "⏱ Duration",
              value: `>>> \`${queue.formattedCurrentTime}\`/\`${track.formattedDuration}\``,
              inline: true,
            },
            {
              name: "⌛ Progress",
              value: createBar(track.duration, queue.currentTime),
              inline: false,
            }
          )
          .setImage(`https://img.youtube.com/vi/${track.id}/mqdefault.jpg`)
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL() ?? "",
          }),
      ],
      ephemeral: true,
    });
  },
});
