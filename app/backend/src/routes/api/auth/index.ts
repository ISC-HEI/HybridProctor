
import { Router } from "express";
import { verifyPostHandler } from "./verify";

const router = Router();

router.post("/verify", verifyPostHandler);

export default router;
