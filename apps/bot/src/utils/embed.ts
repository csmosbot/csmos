import type { APIEmbed } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { config } from "./config";

export class Embed extends EmbedBuilder {
  constructor(data?: APIEmbed) {
    super(data);
    this.setColor(config.colors.primary);
  }
}

export class SuccessEmbed extends EmbedBuilder {
  constructor(data?: APIEmbed) {
    super(data);
    this.setTitle("✅ Success!");
    this.setColor(config.colors.success);
  }
}

export class DangerEmbed extends EmbedBuilder {
  constructor(data?: APIEmbed) {
    super(data);
    this.setTitle("❌ Error");
    this.setColor(config.colors.danger);
  }
}
