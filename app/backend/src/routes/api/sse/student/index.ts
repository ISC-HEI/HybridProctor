import { getIp } from "@/lib/utils/network";
import sseManager from "@services/sse";
import { type Request, type Response } from "express";

/**
 * Establishes a Server-Sent Events connection for a student. No authentication required.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function sseStudentHandler(req: Request, res: Response) {
  const ip = getIp(req);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": "*",
  });

  sseManager.addClient(ip, res, false);

  req.on("close", () => {
    sseManager.removeClient(ip, false);
    res.end();
  })
}
