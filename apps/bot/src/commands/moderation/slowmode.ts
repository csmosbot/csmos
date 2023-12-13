import { Command } from "@/structures/command";
import { DangerEmbed, SuccessEmbed } from "@/utils/embed";
import ms from "ms";

export default new Command({
  name: "slowmode",
  description: "Update the slowmode for a channel.",
  userPermissions: ["ManageChannels"],
  usage: "slowmode <slowmode length | 0>",
  examples: [
    {
      example: "slowmode 0",
      description: "disable the slowmode in the channel you're in",
    },
    {
      example: "slowmode 10s",
      description: "change the slowmode to 10 seconds in the chanenl you're in",
    },
    {
      example: "slowmode 5m #general",
      description: "change the slowmode to 5 minutes in #general",
    },
  ],
  run: ({ message, args }) => {
    const length = args[0];
    if (!length)
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("A length must be specified."),
        ],
      });
    if (ms(length) > ms("6h"))
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Slowmode length cannot be higher than 6 hours."
          ),
        ],
      });

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[1]) ||
      message.channel;
    if (!channel.isTextBased() || channel.isDMBased())
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription(
            "Channel must be a text channel in this server."
          ),
        ],
      });

    channel.setRateLimitPerUser(ms(length) / 1000);

    if (ms(length) === 0)
      return message.channel.send({
        embeds: [
          new SuccessEmbed().setDescription(
            "The slowmode for this channel has been disabled."
          ),
        ],
      });
    else
      return message.channel.send({
        embeds: [
          new SuccessEmbed().setDescription(
            `The slowmode for this channel has been set to **${ms(ms(length), {
              long: true,
            })}**.`
          ),
        ],
      });
  },
});
