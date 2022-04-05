import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import _ from "lodash";
import PairingMatrixGenerator from "pairing-matrix-engine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(readFileSync(process.env.CONFIG_PATH, "utf8"));

const pairingMatrixGenerator = new PairingMatrixGenerator(
  config.username,
  config.repos,
  config.basePath,
  config.sshIdentityFilePath
);

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get(
  "/api/pair-matrix",
  (
    { query: { "since-days": sinceDays, "pull-data": pullData } },
    res,
    next
  ) => {
    pairingMatrixGenerator
      .generatePairingMatrix(
        _.isEmpty(sinceDays) ? 14 : sinceDays,
        pullData === "true"
      )
      .then((matrix) => res.json(matrix))
      .catch(next);
  }
);

app.get("/api/sync", (req, res, next) => {
  pairingMatrixGenerator
    .fetchRepos()
    .then(() => res.sendStatus(200))
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

export default app;
