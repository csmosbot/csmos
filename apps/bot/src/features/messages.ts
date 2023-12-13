import type { BotClient } from "@/structures/client";
import { getUser, updateUser } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("messageCreate", async (message) => {
    if (!message.inGuild() || message.author.bot) return;

    const user = await getUser(message.author.id, message.guild.id);
    const characters = message.content.split("").length;

    await updateUser(message.author.id, message.guild.id, {
      messages: user.messages + 1,
      characters: user.characters + characters,
    });
  });
};
