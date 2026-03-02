
import { Router } from "express";
import upload from "@/lib/utils/multer";
import { examPostHandler } from "./exam";
import { resourcesPostHandler } from "./resources";
import { filesPostHandler } from "./files";

const router = Router();

router.post("/exam", upload.single("exam"), examPostHandler)
router.post("/resources", upload.array("resources"), resourcesPostHandler)
router.post("/files", upload.array("uploads"), filesPostHandler)

export default router;
