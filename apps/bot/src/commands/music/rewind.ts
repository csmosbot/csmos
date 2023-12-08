import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import ms from "ms";

export default new Command({
  name: "rewind",
  description: "Goes backwards in the current song.",
  usage: "rewind <time>",
  run: async ({ client, message, args }) => {
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

    if (!args[0])
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of time to rewind to must be specified."
          ),
        ],
      });

    let seekNumber = parseInt(args[0]);
    if (isNaN(seekNumber)) seekNumber = ms(args[0]);
    if (isNaN(seekNumber))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of time to rewind to must be a number."
          ),
        ],
      });

    const seekTime = queue.currentTime - seekNumber;
    if (seekTime < 0 || seekTime >= queue.songs[0].duration - queue.currentTime)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "The amount of time to rewind to must be greater than the beginning of the current song."
          ),
        ],
      });

    queue.seek(seekTime);

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          `Rewinded to **${queue.formattedCurrentTime}**.`
        ),
      ],
    });
  },
});
