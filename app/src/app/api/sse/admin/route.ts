export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const fetchCache = "force-no-store";


import { getIp } from "@/lib/utils/network";
import sseManager from "@services/sse";
import storage from "@services/storage";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ip = await getIp();
  const sessionId = req.cookies.get("sid");

  if (!sessionId || !sessionId.value || !await storage.verifySession(sessionId.value, ip)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sseManager.encode("init", "Connecting..."));

        sseManager.addClient(ip, controller, true);

        req.signal.addEventListener("abort", () => {
          sseManager.removeClient(ip, true);
          controller.close();
        })

      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(sseManager.encode("error", "Stream interrupted"));
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
