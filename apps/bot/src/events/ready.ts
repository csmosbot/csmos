import { Event } from "@/structures/event";

export default new Event({
  name: "ready",
  run: (client) => console.log(`Logged in as ${client.user.tag}!`),
});
