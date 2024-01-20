import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { getGuild, updateGuild } from "@csmos/db";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Skip to the previous song that played in this server."),
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

    const guild = await getGuild(interaction.guild.id);
    if (guild && guild.nowPlayingMessage)
      queue
        .textChannel!.messages.fetch(guild.nowPlayingMessage)
        .then(async (msg) => {
          msg.edit({
            embeds: [
              new DangerEmbed()
                .setTitle("❌ Stopped")
                .setDescription(
                  `This song was skipped by **${interaction.user.username}**.`
                ),
            ],
            components: [],
          });
          await updateGuild(interaction.guild.id, {
            nowPlayingMessage: null,
          });
        })
        .catch(() => null);

    await queue.previous();

    interaction.reply({
      embeds: [
        new SuccessEmbed().setDescription("Skipped to the previous song."),
      ],
      ephemeral: true,
    });
  },
});
