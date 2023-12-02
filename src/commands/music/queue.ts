import { Command } from "@/structures/command.js";
import { config } from "@/utils/config.js";
import { DangerEmbed, Embed } from "@/utils/embed.js";
import type { ButtonInteraction, EmbedBuilder } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";

export default new Command({
  name: "queue",
  description: "View the queue for this server.",
  run: async ({ client, message }) => {
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

    const embeds: EmbedBuilder[] = [];
    let k = 10;
    const tracks = queue.songs.slice(1, queue.songs.length);
    for (let i = 0; i < tracks.length; i += 10) {
      const qus = tracks;
      const current = qus.slice(i, k);
      let j = i;
      const info = current
        .map(
          (track) =>
            `**${++j}.** [\`${String(track.name)}\`](${track.url}) - \`${
              track.formattedDuration
            }\``
        )
        .join("\n");
      const embed = new Embed()
        .setTitle("📑 Queue")
        .setDescription(info)
        .setFooter({
          text: `${tracks.length} songs in the queue`,
          iconURL: message.guild.iconURL() ?? "",
        });
      if (i < 10) {
        embed.setDescription(
          `**Current song:**\n> [\`${queue.songs[0].name}\`](${queue.songs[0].url}) - \`${queue.songs[0].formattedDuration}\`\n\n${info}`
        );
      }
      embeds.push(embed);
      k += 10;
    }

    const getRow = (cur: number) => {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(config.emotes.previous)
          .setDisabled(cur === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(config.emotes.next)
          .setDisabled(cur === embeds.length - 1)
      );

      return row;
    };

    let cur = 0;
    const res = await message.channel.send({
      embeds: [embeds[0]],
      components: [getRow(cur)],
    });

    const filter = (i: ButtonInteraction<"cached">) =>
      i.user.id === message.author.id;
    const collector = res.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
    });

    collector.on("collect", (i) => {
      if (i.customId !== "prev" && i.customId !== "next") return;

      if (i.customId === "prev" && cur > 0) {
        cur -= 1;
        i.update({
          embeds: [embeds[cur]],
          components: [getRow(cur)],
        });
      } else if (i.customId === "next" && cur < embeds.length - 1) {
        cur += 1;
        i.update({
          embeds: [embeds[cur]],
          components: [getRow(cur)],
        });
      }
    });
  },
});
