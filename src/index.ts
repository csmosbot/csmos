import "./utils/env.js";

import { BotClient } from "./structures/client.js";
const client = new BotClient();
client.connect();
client.register();
