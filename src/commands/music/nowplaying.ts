import { Command } from "@/structures/command.js";
import { DangerEmbed, Embed } from "@/utils/embed.js";
import { createBar } from "@/utils/player.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default new Command({
  name: "nowplaying",
  description: "View the currently playing song in this server.",
  aliases: [
    "np",
    "playing",
    "now-playing",
    "currentlyplaying",
    "currently-playing",
    "current",
  ],
  run: ({ client, message }) => {
    const { channel } = message.member.voice;
    const me = message.guild.members.me!;

    if (!channel)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "You need to be in a voice channel."
          ),
        ],
      });
    if (me.voice.channel && me.voice.channel.id !== channel.id)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("I am in another voice channel."),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Show me!")
              .setURL(
                `https://discord.com/channels/${message.guild.id}/${me.voice.channel.id}`
              )
          ),
        ],
      });
    if (!channel.members.has(me.id) && channel.userLimit !== 0 && channel.full)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("Your voice channel is full."),
        ],
      });
    if (!channel.permissionsFor(me).has("Connect"))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "I do not have permission to connect to your voice channel."
          ),
        ],
      });
    if (!channel.permissionsFor(me).has("Speak"))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "I do not have permission to speak to your voice channel."
          ),
        ],
      });

    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.songs || queue.songs.length === 0)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "No music is being played in this server."
          ),
        ],
      });

    const track = queue.songs[0];

    message.channel.send({
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
            text: message.guild.name,
            iconURL: message.guild.iconURL() ?? "",
          }),
      ],
    });
  },
});
