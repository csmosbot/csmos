import type { BotClient } from "@/structures/client.js";

export default (client: BotClient<true>) => {
  client.on("messageCreate", (message) => {
    if (!message.inGuild() || message.author.bot) return;

    client.db.users.ensure(`${message.guild.id}-${message.author.id}`, {
      messages: 0,
      characters: 0,
    });

    const characters = message.content.split("").length;
    client.db.users.math(
      `${message.guild.id}-${message.author.id}`,
      "+",
      1,
      "messages"
    );
    client.db.users.math(
      `${message.guild.id}-${message.author.id}`,
      "+",
      characters,
      "characters"
    );
  });
};
