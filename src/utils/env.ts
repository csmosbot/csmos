import "dotenv/config";
import { z } from "zod";

const envVariables = z.object({
  TOKEN: z.string(),
  INFINITYBOTS_TOKEN: z.string().optional(),
  TOPGG_TOKEN: z.string().optional(),
  BETTERUPTIME_URL: z.string().optional(),
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
