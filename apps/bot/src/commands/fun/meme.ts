import { Command } from "@/structures/command";
import { Embed } from "@/utils/embed";
import axios from "axios";

export default new Command({
  name: "meme",
  description: "Get a random meme.",
  examples: [
    {
      description: "get a random meme",
    },
  ],
  run: async ({ message }) => {
    const msg = await message.channel.send({
      embeds: [new Embed().setDescription("Getting a random meme...")],
    });

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

    msg.edit({
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
