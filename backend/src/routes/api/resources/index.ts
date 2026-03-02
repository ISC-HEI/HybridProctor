import fs, { Stats } from 'fs';
import path from 'path';
import { type Request, type Response } from 'express';
import mime from 'mime-types';
import logger from '@/lib/services/logger';

export async function resourcesGetHandler(req: Request, res: Response) {
  const file = req.params.file as string;

  if (!file) {
    return res.status(400).json({ error: 'File not specified' });
  }

  try {
    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    const safePath = path.normalize(path.join(resourcesDir, file));

    if (!safePath.startsWith(resourcesDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    const stats: Stats = await fs.promises.stat(safePath)
    const mimeType = mime.lookup(safePath) || 'application/octet-stream';

    res.setHeader("Content-Disposition", `attachment; filename=${path.basename(file)}`);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stats.size.toString());

    const readStream = fs.createReadStream(safePath);
    readStream.on("error", (err) => {
      logger.error(`Error streaming file ${safePath}`);
      console.error(err);

      if (!res.headersSent) {
        res.status(500).json({ error: "Error reading file" });
      } else {
        res.end();
      }
    })

    readStream.pipe(res);

  } catch {
    return res.status(404).json({ error: 'File not found' });
  }
}
