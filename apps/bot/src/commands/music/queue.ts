import { Command } from "@/structures/command";
import { config } from "@/utils/config";
import { DangerEmbed, Embed } from "@/utils/embed";
import { featureIsDisabled } from "@csmos/db";
import type { ButtonInteraction, EmbedBuilder } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the queue for this server."),
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

    const embeds: EmbedBuilder[] = [];
    let k = 10;
    const tracks = queue.songs;
    for (let i = 0; i < tracks.length; i += 10) {
      const qus = tracks;
      const current = qus.slice(i, k);
      const info = current
        .map(
          (track, index) =>
            `**${index + 1}**. [\`${track.name}\`](${track.url}) - \`${
              track.formattedDuration
            }\``
        )
        .join("\n");
      const embed = new Embed()
        .setTitle("📑 Queue")
        .setDescription(info)
        .setFooter({
          text: `${tracks.length} songs in the queue`,
          iconURL: interaction.guild.iconURL() ?? "",
        });
      if (i < 10) {
        embed.setDescription(
          `**Current song**:\n> [\`${queue.songs[0].name}\`](${queue.songs[0].url}) - \`${queue.songs[0].formattedDuration}\`\n\n${info}`
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
    const res = await interaction.reply({
      embeds: [embeds[0]],
      components: [getRow(cur)],
      fetchReply: true,
    });

    const filter = (i: ButtonInteraction<"cached">) =>
      i.user.id === interaction.user.id;
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
