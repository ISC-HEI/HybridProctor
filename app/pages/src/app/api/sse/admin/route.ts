export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const fetchCache = "force-no-store";

import logger from "@/lib/services/logger";
import { getIp } from "@/lib/utils/network";
import sseManager from "@services/sse";
import storage from "@services/storage";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ip = await getIp();
  const sessionId = req.cookies.get("sid");

  if (!sessionId || !sessionId.value || !(await storage.verifySession(sessionId.value, ip))) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(sseManager.encode("error", JSON.stringify({ message: "Unauthorized" })));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
      status: 200,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sseManager.addClient(ip, controller, req.signal, true);

        req.signal.onabort = () => {
          sseManager.removeClient(ip, true);
          controller.close();
        };
      } catch (error) {
        logger.error("Stream error");
        console.error(error);
        try {
          controller.enqueue(sseManager.encode("error", JSON.stringify({ message: "Stream interrupted" })));
        } catch {}
        sseManager.removeClient(ip, true);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "X-Accel-Buffering": "no",
    },
    status: 200,
  });
}
