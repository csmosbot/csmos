import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
});
