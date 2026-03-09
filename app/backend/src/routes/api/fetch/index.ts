
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

router.post("/items", async (req, res) => {
  return res.status(200).json(await storage.readDir(decodeURIComponent(req.body.path)));
});
router.get("/disk", async (req, res) => {
  return res.status(200).json(await storage.getDiskUsage());
});

router.get("/newpassword", (req, res) => {
  return res.status(200).send(storage.newPassword);
});

router.get("/locked", (req, res) => {
  return res.status(200).json({ locked: storage.locked });
});

export default router;
