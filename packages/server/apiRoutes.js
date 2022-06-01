import express from "express";
import PairingMatrixService from "./PairingMatrixService.js";

const pairingMatrixService = new PairingMatrixService();

const router = express.Router();

router.get("/pair-matrix", ({ query }, res, next) => {
  const {
    "since-days": sinceDays,
    "pull-data": pullData,
    "aggregate-by": aggregateBy,
  } = query;

  return pairingMatrixService
    .generatePairingMatrix(sinceDays, aggregateBy, pullData === "true")
    .then((matrix) => res.json(matrix))
    .catch(next);
});

router.get("/sync", (req, res, next) => {
  return pairingMatrixService
    .fetchRepos()
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

export default router;
