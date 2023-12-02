import type { BotClient } from "@/structures/client.js";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type MessageEditOptions,
  type MessageReplyOptions,
} from "discord.js";
import type { Queue, Song } from "distube";
import { DisTube, RepeatMode } from "distube";
import { config } from "./config.js";
import { DangerEmbed, Embed, SuccessEmbed } from "./embed.js";

let songEditInterval: ReturnType<typeof setInterval> | null = null;

export function formatRepeatMode(repeatMode: RepeatMode) {
  switch (repeatMode) {
    case RepeatMode.QUEUE: {
      return "Queue";
    }
    case RepeatMode.SONG: {
      return "Song";
    }
    default: {
      return null;
    }
  }
}

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

    const nowPlayingMessage = await queue
      .textChannel!.send(recieveQueueData(queue, track))
      .then((msg) => {
        client.db.guilds.set(queue.id, msg.id, "nowPlayingMessage");
        return msg;
      });

    const edited = false;

    try {
      if (songEditInterval) clearInterval(songEditInterval);
    } catch {
      // do nothing
    }

    songEditInterval = setInterval(async () => {
      if (edited) return;
      try {
        const newQueue = client.player.getQueue(queue.id)!;
        await nowPlayingMessage.edit(
          recieveQueueData(newQueue, newQueue.songs[0]) as MessageEditOptions
        );
      } catch (e) {
        if (songEditInterval) clearInterval(songEditInterval);
      }
    }, 10000);

    const collector = nowPlayingMessage.createMessageComponentCollector({
      time: track.duration ? track.duration * 1000 : 600000,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (i) => {
      const { channel } = i.member.voice;
      const me = i.guild.members.me!;

      if (!channel)
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "You need to be in a voice channel."
            ),
          ],
          ephemeral: true,
        });
      if (me.voice.channel && me.voice.channel.id !== channel.id)
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription("I am in another voice channel."),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Show me!")
                .setURL(
                  `https://discord.com/channels/${i.guild.id}/${me.voice.channel.id}`
                )
            ),
          ],
          ephemeral: true,
        });
      if (
        !channel.members.has(me.id) &&
        channel.userLimit !== 0 &&
        channel.full
      )
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription("Your voice channel is full."),
          ],
          ephemeral: true,
        });
      if (!channel.permissionsFor(me).has("Connect"))
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "I do not have permission to connect to your voice channel."
            ),
          ],
          ephemeral: true,
        });
      if (!channel.permissionsFor(me).has("Speak"))
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "I do not have permission to speak to your voice channel."
            ),
          ],
          ephemeral: true,
        });

      const newQueue = client.player.getQueue(i.guild.id);
      if (!newQueue || !newQueue.songs || newQueue.songs.length === 0)
        return void i.reply({
          embeds: [
            new DangerEmbed().setDescription(
              "No music is being played in this server."
            ),
          ],
          ephemeral: true,
        });

      switch (i.customId) {
        case "previous":
          {
            await queue.previous();

            nowPlayingMessage.edit({
              embeds: [
                new DangerEmbed()
                  .setTitle("❌ Stopped")
                  .setDescription(
                    `This song was skipped by **${i.user.username}**.`
                  ),
              ],
              components: [],
            });
            client.db.guilds.delete(queue.id, "nowPlayingMessage");
            i.reply({
              embeds: [
                new SuccessEmbed().setDescription("Skipped to previous song."),
              ],
              ephemeral: true,
            });
          }
          break;
        case "playpause":
          {
            if (queue.paused) {
              queue.resume();
              nowPlayingMessage.edit(
                recieveQueueData(
                  newQueue,
                  newQueue.songs[0]
                ) as MessageEditOptions
              );
              i.reply({
                embeds: [
                  new SuccessEmbed().setDescription(
                    "Resumed the current song."
                  ),
                ],
                ephemeral: true,
              });
            } else {
              queue.pause();
              nowPlayingMessage.edit(
                recieveQueueData(
                  newQueue,
                  newQueue.songs[0]
                ) as MessageEditOptions
              );
              i.reply({
                embeds: [
                  new SuccessEmbed().setDescription("Paused the current song."),
                ],
                ephemeral: true,
              });
            }
          }
          break;
        case "next":
          {
            queue.skip();
            nowPlayingMessage.edit({
              embeds: [
                new DangerEmbed()
                  .setTitle("❌ Stopped")
                  .setDescription(
                    `This song was skipped by **${i.user.username}**.`
                  ),
              ],
              components: [],
            });
            client.db.guilds.delete(queue.id, "nowPlayingMessage");
            i.reply({
              embeds: [
                new SuccessEmbed().setDescription("Skipped the current song."),
              ],
              ephemeral: true,
            });
          }
          break;
        case "stop":
          {
            queue.stop();
            nowPlayingMessage.edit({
              embeds: [
                new DangerEmbed()
                  .setTitle("❌ Stopped")
                  .setDescription(
                    `The queue was stopped by **${i.user.username}**.`
                  ),
              ],
              components: [],
            });
            client.db.guilds.delete(queue.id, "nowPlayingMessage");
            i.reply({
              embeds: [new SuccessEmbed().setDescription("Stopped the queue.")],
              ephemeral: true,
            });
          }
          break;
        case "shuffle":
          {
            if (client.maps.has(`beforeshuffle-${newQueue.id}`)) {
              newQueue.songs = [
                newQueue.songs[0],
                ...client.maps.get(`beforeshuffle-${newQueue.id}`),
              ];
              client.maps.delete(`beforeshuffle-${newQueue.id}`);
              i.reply({
                embeds: [
                  new SuccessEmbed().setDescription("Unshuffled the queue."),
                ],
                ephemeral: true,
              });
            } else {
              client.maps.set(
                `beforeshuffle-${newQueue.id}`,
                newQueue.songs.slice(1)
              );
              await newQueue.shuffle();
              i.reply({
                embeds: [
                  new SuccessEmbed().setDescription("Shuffled the queue."),
                ],
                ephemeral: true,
              });
            }
          }
          break;
        case "loop":
          {
            const repeat = newQueue.setRepeatMode();
            const newRepeat = formatRepeatMode(repeat);

            nowPlayingMessage.edit(
              recieveQueueData(
                newQueue,
                newQueue.songs[0]
              ) as MessageEditOptions
            );
            i.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  newRepeat?.length
                    ? `Set loop mode to: ${newRepeat}.`
                    : "Disabled loop."
                ),
              ],
              ephemeral: true,
            });
          }
          break;
        case "forward":
          {
            let seektime = newQueue.currentTime + 10;
            if (seektime >= newQueue.songs[0].duration)
              seektime = newQueue.songs[0].duration - 1;
            newQueue.seek(Number(seektime));
            collector.resetTimer({
              time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000,
            });

            nowPlayingMessage.edit(
              recieveQueueData(
                newQueue,
                newQueue.songs[0]
              ) as MessageEditOptions
            );
            i.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Skipped to \`${newQueue.formattedCurrentTime}\`.`
                ),
              ],
              ephemeral: true,
            });
          }
          break;
        case "rewind":
          {
            let seektime = newQueue.currentTime - 10;
            if (seektime < 0) seektime = 0;
            if (seektime >= newQueue.songs[0].duration - newQueue.currentTime)
              seektime = 0;
            newQueue.seek(Number(seektime));
            collector.resetTimer({
              time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000,
            });

            nowPlayingMessage.edit(
              recieveQueueData(
                newQueue,
                newQueue.songs[0]
              ) as MessageEditOptions
            );
            i.reply({
              embeds: [
                new SuccessEmbed().setDescription(
                  `Rewinded to \`${newQueue.formattedCurrentTime}\`.`
                ),
              ],
              ephemeral: true,
            });
          }
          break;
      }
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
          name: "Now playing",
          iconURL:
            "https://cdn.discordapp.com/emojis/994438540429643806.webp?size=160&quality=lossless",
        })
        .setTitle(track.name!)
        .setURL(track.url)
        .addFields(
          {
            name: "💡 Requested by",
            value: `>>> ${track.member}`,
            inline: true,
          },
          {
            name: "⏱ Duration",
            value: `>>> \`${queue.formattedCurrentTime}\`/\`${track.formattedDuration}\``,
            inline: true,
          }
        )
        .setImage(`https://img.youtube.com/vi/${track.id}/mqdefault.jpg`);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji(config.emotes.player.previous)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(
            !queue.previousSongs || queue.previousSongs.length === 0
          ),
        new ButtonBuilder()
          .setCustomId("playpause")
          .setEmoji(
            queue.playing
              ? config.emotes.player.pause
              : config.emotes.player.play
          )
          .setStyle(
            queue.playing ? ButtonStyle.Secondary : ButtonStyle.Success
          ),
        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji(config.emotes.player.next)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(queue.songs.length <= 1),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji(config.emotes.player.stop)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji(config.emotes.player.shuffle)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(queue.songs.length <= 1)
      );
      const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji(
            queue.repeatMode === RepeatMode.SONG
              ? config.emotes.player.loop.single
              : config.emotes.player.loop.default
          )
          .setStyle(
            queue.repeatMode === RepeatMode.DISABLED
              ? ButtonStyle.Secondary
              : ButtonStyle.Success
          ),
        new ButtonBuilder()
          .setCustomId("forward")
          .setEmoji(config.emotes.player.forward)
          .setLabel("+10s")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(Math.floor(track.duration - queue.currentTime) <= 10),
        new ButtonBuilder()
          .setCustomId("rewind")
          .setEmoji(config.emotes.player.rewind)
          .setLabel("-10s")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(Math.floor(queue.currentTime) < 10)
      );

      return {
        embeds: [embed],
        components: [row, row2],
      };
    }
  });

  return player;
}
