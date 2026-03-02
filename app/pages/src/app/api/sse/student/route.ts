export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const fetchCache = "force-no-store";


import { getIp } from "@/lib/utils/network";
import sseManager from "@services/sse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ip = await getIp();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sseManager.addClient(ip, controller, req.signal, false);

        req.signal.onabort = () => {
          sseManager.removeClient(ip, false);
          controller.close();
        };
      } catch (error) {
        console.error("Stream error:", error);
        try {
          controller.enqueue(sseManager.encode("error", JSON.stringify({ message: "Stream interrupted" })));
        } catch {}
        sseManager.removeClient(ip, false);
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
