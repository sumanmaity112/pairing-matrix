import express from "express";
import * as path from "path";
import { getBaseDirectory } from "./utils.js";
import apiRoutes from "./apiRoutes.js";

const __dirname = getBaseDirectory();

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.use("/api", apiRoutes);

export default app;
