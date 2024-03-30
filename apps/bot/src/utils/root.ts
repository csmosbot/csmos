import path from "path";

export const ROOT_DIR = path.join(__dirname, "../../../..").endsWith("apps")
  ? path.join(__dirname, "../../../../../")
  : path.join(__dirname, "../../../..");
