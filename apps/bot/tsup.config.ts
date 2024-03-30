import "./src/utils/env";
import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs"],
  entry: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts*",
    "src/**/*.tsx",
  ],
  clean: true,
  legacyOutput: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
  tsconfig: "tsconfig.json",
  noExternal: ["@csmos/db"],
});
