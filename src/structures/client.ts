import { botOptions } from "@/utils/bot-options";
import { env } from "@/utils/env";
import { Client } from "discord.js";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  constructor() {
    super(botOptions);
  }

  connect() {
    this.login(env.TOKEN);
    this.on("ready", () => {
      console.log("ready");
    });
  }
}
