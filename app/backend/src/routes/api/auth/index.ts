
import { Router } from "express";
import { verifyPostHandler } from "./verify";
import { passwordPatchHandler } from "./password";

const router = Router();

router.post("/verify", verifyPostHandler);
router.patch("/password", passwordPatchHandler);

export default router;
