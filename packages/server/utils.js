import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";

export const getBaseDirectory = () =>
  path.dirname(fileURLToPath(import.meta.url));

export const getPairingMatrixConfig = () =>
  JSON.parse(readFileSync(process.env.CONFIG_PATH, "utf8"));
