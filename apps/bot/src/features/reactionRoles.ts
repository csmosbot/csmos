import type { BotClient } from "@/structures/client";
import { getReactionRoleByEmojiAndMessageId } from "@csmos/db";

export default (client: BotClient<true>) => {
  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (!reaction.message.guild) return;

    const role = await getReactionRoleByEmojiAndMessageId(
      reaction.emoji.name ?? reaction.emoji.id!,
      reaction.message.id
    );
    if (!role) return;

    let member = reaction.message.guild.members.cache.get(user.id);
    if (!member) member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.add(role.roleId);
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (!reaction.message.guild) return;

    const role = await getReactionRoleByEmojiAndMessageId(
      reaction.emoji.name ?? reaction.emoji.id!,
      reaction.message.id
    );
    if (!role) return;

    let member = reaction.message.guild.members.cache.get(user.id);
    if (!member) member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.remove(role.roleId);
  });
};
