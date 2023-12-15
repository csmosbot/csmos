export const eightBall = {
  choices: [
    "It's certain",
    "It's decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
  ],
} as const;

export const coinflip = {
  outcomes: ["heads", "tails"],
} as const;

export const randomChoice = <T extends string[] | readonly string[]>(
  choices: T
): T[number] => choices[Math.floor(Math.random() * choices.length)];
