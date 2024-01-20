import { Command } from "@/structures/command";
import { DangerEmbed, Embed, SuccessEmbed } from "@/utils/embed";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song in your voice channel.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(
          "The title, URL, or keywords of the song you want to play."
        )
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

    const query = interaction.options.getString("query", true);

    const queue = client.player.getQueue(interaction.guild.id);

    await interaction.reply({
      embeds: [
        new Embed()
          .setTitle("🔍 Searching...")
          .setDescription(`\`\`\`${query}\`\`\``),
      ],
      ephemeral: true,
    });

    await client.player.play(channel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
    });

    interaction.editReply({
      embeds: [
        new SuccessEmbed()
          .setTitle(
            (queue?.songs?.length ?? 0) > 0 ? "➕ Added" : "🎶 Now playing"
          )
          .setDescription(`\`\`\`${query}\`\`\``),
      ],
    });
  },
});
