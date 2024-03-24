import { event } from "@/structures/event";

export default event("ready", (client) =>
  console.log(`Logged in as ${client.user.username}!`)
);
