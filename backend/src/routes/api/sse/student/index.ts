import { getIp } from "@/lib/utils/network";
import sseManager from "@services/sse";
import storage from "@services/storage";
import { type Request, type Response } from "express";

export async function sseStudentHandler(req: Request, res: Response) {
  const ip = await getIp();
  const sessionId = req.cookies?.sid;

  if (!sessionId || !(await storage.verifySession(sessionId, ip))) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    });

    res.write(`event: error\ndata: ${JSON.stringify({ message: "Unauthorized" })}\n\n`);
    return res.end();
  }

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
