import { SlashCommand } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import ms from "ms";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Update the slowmode for this channel.")
    .addStringOption((option) =>
      option
        .setName("length")
        .setDescription("The length of slowmode.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to update the slowmode of.")
        .addChannelTypes(
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.PrivateThread,
          ChannelType.AnnouncementThread,
          ChannelType.GuildText,
          ChannelType.GuildForum,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice,
          ChannelType.GuildMedia
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: ({ interaction }) => {
    const length = interaction.options.getString("length", true);
    if (ms(length) > ms("6h"))
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "Slowmode length cannot be higher than 6 hours."
          ),
        ],
        ephemeral: true,
      });

    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    if (!channel.isTextBased() || channel.isDMBased())
      return interaction.reply({
        embeds: [
          new DangerEmbed().setDescription(
            "Channel must be a text channel in this server."
          ),
        ],
        ephemeral: true,
      });

    channel.setRateLimitPerUser(ms(length) / 1000);

    if (ms(length) === 0)
      return interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            "The slowmode for this channel has been disabled."
          ),
        ],
        ephemeral: true,
      });
    else
      return interaction.reply({
        embeds: [
          new SuccessEmbed().setDescription(
            `The slowmode for this channel has been set to **${ms(ms(length), {
              long: true,
            })}**.`
          ),
        ],
        ephemeral: true,
      });
  },
});
