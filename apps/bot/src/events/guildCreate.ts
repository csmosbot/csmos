import { event } from "@/structures/event";
import { Embed } from "@/utils/embed";
import { createGuild } from "@csmos/db";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";

export default event("guildCreate", async (client, guild) => {
  await createGuild(guild.id);

  function sendMessage(id: string) {
    const channel = guild.channels.cache.get(id);
    if (!channel || !channel.isTextBased()) return;

    return channel.send({
      embeds: [
        new Embed()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTitle("Hello there! 👋")
          .setDescription(
            "Thanks for inviting me to your server! I hope I can help you turn this into the Discord server of your dreams!\n\nTo get started, run `/help` to view all my commands."
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Join the support server")
            .setEmoji("<:discord:1043438510616608779>")
            .setURL("https://discord.com/invite/q7WNcPakYh")
            .setStyle(ButtonStyle.Link)
        ),
      ],
    });
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
});
