import type { BotClient } from "@/structures/client.js";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { DisTube } from "distube";

export function createDistube(client: BotClient) {
  const distube = new DisTube(client, {
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

  distube.on("initQueue", (queue) => {
    client.db.guilds.ensure(queue.id, {
      defaultVolume: 50,
    });

    const data = client.db.guilds.get(queue.id);
    queue.setVolume(data.defaultVolume);
  });

  distube.on("playSong", (queue, track) => {
    if (!client.guilds.cache.get(queue.id)!.members.me!.voice.deaf)
      client.guilds.cache.get(queue.id)!.members.me!.voice.setDeaf(true);

    // TODO: now playing message
  });

  return distube;
}
