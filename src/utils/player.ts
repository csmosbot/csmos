import type { BotClient } from "@/structures/client.js";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import type { MessageReplyOptions } from "discord.js";
import type { Queue, Song } from "distube";
import { DisTube } from "distube";
import { DangerEmbed, Embed } from "./embed.js";

export function createPlayer(client: BotClient) {
  const player = new DisTube(client, {
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 0,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true,
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin(),
    ],
    ytdlOptions: {
      highWaterMark: 1024 * 1024 * 64,
      quality: "highestaudio",
      liveBuffer: 60000,
      dlChunkSize: 1024 * 1024 * 4,
    },
  });

  player.on("initQueue", (queue) => {
    client.db.guilds.ensure(queue.id, {
      defaultVolume: 50,
    });

    const data = client.db.guilds.get(queue.id);
    queue.setVolume(data.defaultVolume);
  });

  player.on("playSong", async (queue, track) => {
    if (!client.guilds.cache.get(queue.id)!.members.me!.voice.deaf)
      client.guilds.cache.get(queue.id)!.members.me!.voice.setDeaf(true);

    await queue
      .textChannel!.send(recieveQueueData(queue, track))
      .then((msg) => {
        client.db.guilds.set(queue.id, msg.id, "nowPlayingMessage");
        return msg;
      });
  });

  function recieveQueueData(
    queue: Queue,
    track: Song<unknown>
  ): MessageReplyOptions {
    if (!queue || !track)
      return {
        embeds: [
          new DangerEmbed().setDescription(
            "An error happened on our end while trying to create the now playing embed."
          ),
        ],
      };

    const embed = new Embed()
      .setAuthor({
        name: track.name!,
        iconURL:
          "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif",
        url: track.url,
      })
      .setThumbnail(`https://img.youtube.com/vi/${track.id}/mqdefault.jpg`)
      .addFields(
        {
          name: "💡 Requested by:",
          value: `>>> ${track.member}`,
          inline: true,
        },
        {
          name: "⏱ Duration:",
          value: `>>> \`${queue.formattedCurrentTime}\`/\`${track.formattedDuration}\``,
          inline: true,
        }
      );

    return {
      embeds: [embed],
    };
  }

  return player;
}
