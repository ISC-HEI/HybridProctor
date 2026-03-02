import { type Request, type Response } from "express";
import path from "path";
import os from "os";
import fs from "fs";
import { PassThrough } from "stream";
import logger from "@/lib/services/logger";

export async function downloadGetHandler(req: Request, res: Response) {
  const { id } = req.params;
  const sanitizedId = path.basename(id?.toString() as string);

  if (sanitizedId !== id) {
    return res.status(400).send("Invalid file ID");
  }
  
  const tempPath = path.join(os.tmpdir(), sanitizedId);

  try {
    if (!fs.existsSync(tempPath)) {
        return res.status(404).send("File not found");
    }

    const stat = fs.statSync(tempPath);
    const dataStream = fs.createReadStream(tempPath);
    const passThrough = new PassThrough();

    dataStream.pipe(passThrough);

    dataStream.on("end", () => {
      fs.unlink(tempPath, (err) => {
        if (err) {
          logger.error(`Failed to delete temp file ${tempPath}`);
          console.error(err);
        }
      });
    });

    dataStream.on("error", (err) => {
      logger.error(`Error reading temp file ${tempPath}`);
      console.error(err);
      passThrough.end();
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Length", stat.size.toString());
    res.setHeader("Content-Disposition", `attachment; filename="download.zip"`);

    passThrough.pipe(res);

  } catch (error) {
    logger.error("An error occured creating temp file.");
    console.error(error);
    return res.status(500).send("An error occurred");
  }
}
