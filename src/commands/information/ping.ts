import { Command } from "@/structures/command.js";

export default new Command({
  name: "ping",
  description: "Pings the bot.",
  run: ({ message }) => message.channel.send("Pong!"),
});
