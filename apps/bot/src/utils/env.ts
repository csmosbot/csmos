import { z } from "zod";

const envVariables = z.object({
  DISCORD_TOKEN: z.string(),
});

const parsed = envVariables.safeParse(process.env);
if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new SyntaxError("Invalid environment variables");
}

export const env = parsed.data;
