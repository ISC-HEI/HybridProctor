import { type Request, type Response } from "express";
import path from "path";
import os from "os";
import fs from "fs";
import { PassThrough } from "stream";
import logger from "@/lib/services/logger";

/**
 * Downloads a prepared zip archive from a temporary file and removes it after streaming.
 * @param req - The Express request object (contains :id param).
 * @param res - The Express response object.
 */
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
        }
      });
    });

    dataStream.on("error", (err) => {
      logger.error(`Error reading temp file ${tempPath}`);
      passThrough.end();
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Length", stat.size.toString());
    res.setHeader("Content-Disposition", `attachment; filename="download.zip"`);

    passThrough.pipe(res);

  } catch (error) {
    logger.error("An error occured creating temp file.");

    return res.status(500).send("An error occurred");
  }
}
