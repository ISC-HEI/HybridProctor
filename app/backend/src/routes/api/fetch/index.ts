
import storage from "@/lib/services/storage";
import { Router } from "express";

const router = Router();

router.get("/resources", (req, res) => {
  res.status(200).json(storage.resources);
});

router.get("/config", (req, res) => {
  res.status(200).json(storage.examConfig);
});

router.get("/version", (req, res) => {
  return res.status(200).send(storage.version);
});

export default router;
