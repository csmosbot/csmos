import { Command } from "@/structures/command.js";
import { DangerEmbed, Embed, SuccessEmbed } from "@/utils/embed.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default new Command({
  name: "play",
  description: "Play a song in your voice channel.",
  aliases: ["p"],
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
          new DangerEmbed().setDescription(
            "I am already in another voice channel."
          ),
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

    const query = args.join(" ");
    if (!query)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A search query must be specified."),
        ],
      });

    const queue = client.player.getQueue(message.guild.id);

    const msg = await message.channel.send({
      embeds: [
        new Embed()
          .setTitle("🔍 Searching...")
          .setDescription(`\`\`\`${query}\`\`\``),
      ],
    });

    await client.player.play(channel, query, {
      member: message.member,
      textChannel: message.channel,
    });

    msg.edit({
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
