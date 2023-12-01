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

  return distube;
}
