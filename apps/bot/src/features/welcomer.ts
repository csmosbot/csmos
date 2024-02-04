import type { BotClient } from "@/structures/client";
import { replaceVars } from "@/utils/variables";
import { getWelcomer } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("guildMemberAdd", async (member) => {
    const welcomer = await getWelcomer(member.guild.id);
    if (!welcomer) return;

    const channel = member.guild.channels.cache.get(welcomer.channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !channel.permissionsFor(member.guild.members.me!).has("SendMessages")
    )
      return;

    await channel.send({
      content: replaceVars({
        message: welcomer.message,
        user: member.user,
        guild: member.guild,
      }),
    });
  });
};
