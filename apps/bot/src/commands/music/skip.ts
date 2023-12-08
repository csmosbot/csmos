import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default new Command({
  name: "skip",
  description: "Skips the current song.",
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

    queue
      .textChannel!.messages.fetch(
        client.db.guilds.get(message.guild.id, "nowPlayingMessage")
      )
      .then((msg) => {
        msg.edit({
          embeds: [
            new DangerEmbed()
              .setTitle("❌ Stopped")
              .setDescription(
                `This song was skipped by **${message.author.username}**.`
              ),
          ],
          components: [],
        });
        client.db.guilds.delete(message.guild.id, "nowPlayingMessage");
      })
      .catch(() => null);

    await queue.skip();

    message.channel.send({
      embeds: [new SuccessEmbed().setDescription("Skipped the current song.")],
    });
  },
});
