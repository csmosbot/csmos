import type { BotClient } from "@/structures/client";
import { replaceVars } from "@/utils/variables";
import { getLeaver } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("guildMemberRemove", async (member) => {
    const leaver = await getLeaver(member.guild.id);
    if (!leaver) return;

    const channel = member.guild.channels.cache.get(leaver.channelId);
    if (
      !channel ||
      !channel.isTextBased() ||
      !channel.permissionsFor(member.guild.members.me!).has("SendMessages")
    )
      return;

    await channel.send({
      content: replaceVars({
        message: leaver.message,
        user: member.user,
        guild: member.guild,
      }),
    });
  });
};
