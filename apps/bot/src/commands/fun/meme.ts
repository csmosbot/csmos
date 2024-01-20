import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import axios from "axios";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random meme."),
  run: async ({ interaction }) => {
    await interaction.deferReply();

    const { data: content } = await axios.get(
      "https://www.reddit.com/r/memes/random/.json"
    );
    const meme = {
      permalink: `https://reddit.com${content[0].data.children[0].data.permalink}`,
      title: content[0].data.children[0].data.title,
      image: content[0].data.children[0].data.url,
      likes: content[0].data.children[0].data.ups,
      dislikes: content[0].data.children[0].data.downs,
      comments: content[0].data.children[0].data.num_comments,
    };

    interaction.followUp({
      embeds: [
        new Embed()
          .setTitle(meme.title)
          .setURL(meme.permalink)
          .setImage(meme.image)
          .setFooter({
            text: `👍 ${meme.likes} 👎 ${meme.dislikes} 💬 ${meme.comments}`,
          }),
      ],
    });
  },
});
