import type { Guild, User } from "discord.js";

export const replaceVars = ({
  message,
  user,
  guild,
}: {
  message: string;
  user: User;
  guild: Guild;
}) =>
  message
    .replace("{user.name}", user.displayName)
    .replace("{user.username}", user.username)
    .replace("{user.id}", user.id)
    .replace("{user.mention}", `<@${user.id}>`)
    .replace("{server.name}", guild.name)
    .replace("{server.members}", guild.memberCount.toLocaleString());
