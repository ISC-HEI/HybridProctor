
import { Router } from "express";
import { heartbeatPostHandler } from "./heartbeat";
import { downloadGetHandler } from "./download";
import { resourcesGetHandler } from "./resources";
import { sseAdminHandler } from "./sse/admin";
import { sseStudentHandler } from "./sse/student";
import uploadRouter from "./upload";

const router = Router();

router.post("/heartbeat", heartbeatPostHandler);
router.get("/download/:id", downloadGetHandler);
router.get("/resources/:file", resourcesGetHandler);
router.get("/sse/admin", sseAdminHandler);
router.get("/sse/student", sseStudentHandler);

router.use("/upload", uploadRouter)

export default router;
