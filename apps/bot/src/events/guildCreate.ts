import { Event } from "@/structures/event";
import { config } from "@/utils/config";
import { Embed } from "@/utils/embed";
import { createGuild } from "@csmos/db";
import { ChannelType } from "discord.js";

export default new Event({
  name: "guildCreate",
  run: async (client, guild) => {
    await createGuild(guild.id);

    function sendMessage(id: string) {
      const embed = new Embed()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle("Hello there! 👋")
        .setDescription(
          `Thanks for inviting me to your server! I hope I can help you turn this into the Discord server of your dreams!\n\nBy default, my prefix is \`${config.prefix}\`. To get started, type \`${config.prefix}help\` to view all my commands.`
        );

      const channel = guild.channels.cache.get(id);
      if (!channel || !channel.isTextBased()) return;

      return channel.send({ embeds: [embed] });
    }

    if (guild.publicUpdatesChannelId) sendMessage(guild.publicUpdatesChannelId);
    else if (guild.systemChannelId) sendMessage(guild.systemChannelId);
    else {
      const channel = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildText &&
          c.permissionsFor(client.user)?.has(["SendMessages", "EmbedLinks"])
      );
      sendMessage(channel!.id);
    }
  },
});
