import { Command } from "@/structures/command";
import { DangerEmbed, Embed } from "@/utils/embed";
import { eightBall, randomChoice } from "@/utils/games";

export default new Command({
  name: "8ball",
  description: "Ask a question to the magic 8 ball.",
  usage: "8ball <question>",
  examples: [
    {
      example: "8ball is csmos a good bot?",
      description: "ask the magic 8 ball the question 'is csmos a good bot?'",
    },
  ],
  run: ({ message, args }) => {
    if (!args[0])
      return message.channel.send({
        embeds: [
          new DangerEmbed().setDescription("The question must be specified."),
        ],
      });

    const question = args.join(" ");
    const response = randomChoice(eightBall.choices);

    message.channel.send({
      embeds: [
        new Embed().setTitle("🎱 8 Ball").addFields(
          {
            name: "Question",
            value: question,
          },
          {
            name: "Answer",
            value: response,
          }
        ),
      ],
    });
  },
});
