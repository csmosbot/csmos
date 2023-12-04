import { Command } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed.js";
import { getPrefix } from "@/utils/prefix.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default new Command({
  name: "unshuffle",
  description: "Unshuffles the queue in this server.",
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

    if (!client.maps.has(`beforeshuffle-${queue.id}`))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            `The queue in this server has never been shuffled. Try using \`${getPrefix(
              client,
              message.guild.id
            )}shuffle\` instead.`
          ),
        ],
      });

    queue.songs = [
      queue.songs[0],
      ...client.maps.get(`beforeshuffle-${queue.id}`),
    ];
    client.maps.delete(`beforeshuffle-${queue.id}`);

    message.channel.send({
      embeds: [new SuccessEmbed().setDescription("Unshuffled the queue.")],
    });
  },
});
