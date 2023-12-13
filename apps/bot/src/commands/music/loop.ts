import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { formatRepeatMode } from "@/utils/player";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { RepeatMode } from "distube";

export default new Command({
  name: "loop",
  description: "Set the loop mode for the queue in this server.",
  usage: ["loop", "loop off", "loop song", "loop queue"],
  examples: [
    {
      description: "toggle the loop mode",
    },
    {
      example: "loop off",
      description: "disable loop",
    },
    {
      example: "loop song",
      description: "loop the current song",
    },
    {
      example: "loop queue",
      description: "loop the queue",
    },
  ],
  run: ({ client, message, args }) => {
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

    let loop: number | undefined = undefined;
    const mode = args[0];
    if (mode) {
      if (
        !["off", "song", "track", "queue", "0", "1", "2"].includes(
          mode.toLowerCase()
        )
      )
        return message.channel.send({
          embeds: [
            new DangerEmbed().setDescription(
              "Invalid loop mode specified. Loop mode can be `off`, `song`, or `queue`."
            ),
          ],
        });
      if (mode.toLowerCase() === "off" || mode.toLowerCase() === "0")
        loop = RepeatMode.DISABLED;
      else if (
        mode.toLowerCase() === "song" ||
        mode.toLowerCase() === "track" ||
        mode.toLowerCase() === "1"
      )
        loop = RepeatMode.SONG;
      else if (mode.toLowerCase() === "queue" || mode.toLowerCase() === "2")
        loop = RepeatMode.QUEUE;
    }

    const repeat = queue.setRepeatMode(loop);
    const newRepeat = formatRepeatMode(repeat);

    message.channel.send({
      embeds: [
        new SuccessEmbed().setDescription(
          newRepeat?.length
            ? `Set loop mode to: ${newRepeat}.`
            : "Disabled loop."
        ),
      ],
    });
  },
});
