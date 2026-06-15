
import { Router } from "express";
import { heartbeatPostHandler } from "./heartbeat";
import { downloadGetHandler } from "./download";
import { resourcesGetHandler } from "./resources";
import { sseAdminHandler } from "./sse/admin";
import { sseStudentHandler } from "./sse/student";
import uploadRouter from "./upload";
import fetchRouter from "./fetch";
import authRouter from "./auth";
import { preparePostHandler } from "./prepare";
import { statusPostHandler } from "./status";
import { registerPatchHandler, registerPostHandler } from "./register";
import { lockPostHandler } from "./lock";
import { hashPostHandler } from "./hash";
import { timePostHandler } from "./time";
import { hidePostHandler } from "./hide";

const router = Router();

router.post("/prepare", preparePostHandler);
router.post("/heartbeat", heartbeatPostHandler);
router.get("/download/:id", downloadGetHandler);
router.get("/resources/:file", resourcesGetHandler);
router.get("/sse/admin", sseAdminHandler);
router.get("/sse/student", sseStudentHandler);
router.post("/status", statusPostHandler);
router.post("/register", registerPostHandler);
router.patch("/register", registerPatchHandler);
router.post("/lock", lockPostHandler);
router.post("/hash", hashPostHandler);
router.post("/time", timePostHandler);
router.post("/hide", hidePostHandler);

router.use("/upload", uploadRouter);
router.use("/fetch", fetchRouter);
router.use("/auth", authRouter);

export default router;
