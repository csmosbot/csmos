import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import { SlashCommandBuilder } from "discord.js";

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0, 0, 0";
}

function hexToHsl(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return h + "%, " + s + "%, " + l + "%";
}

export default new Command({
  data: new SlashCommandBuilder()
    .setName("randomcolor")
    .setDescription("Get a random color."),
  run: ({ interaction }) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    interaction.reply({
      embeds: [
        new Embed()
          .setTitle("🎨 Random Color")
          .addFields(
            { name: "HEX", value: `#${randomColor}`, inline: true },
            { name: "RGB", value: hexToRgb(randomColor), inline: true },
            { name: "HSL", value: hexToHsl(randomColor), inline: true }
          )
          .setImage(`https://api.popcat.xyz/color/image/${randomColor}`)
          .setColor(`#${randomColor}`),
      ],
    });
  },
});
