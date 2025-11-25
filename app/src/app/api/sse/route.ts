export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
export const fetchCache = "force-no-store";


import sseManager from "@services/sse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sseManager.encode("init", "Connecting..."));

        sseManager.addClient(controller);

        req.signal.addEventListener("abort", () => {
          sseManager.removeClient(controller);
          controller.close();
        })

      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(sseManager.encode("error", "Stream interrupted"));
        sseManager.removeClient(controller);
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
    },
    status: 200,
  });
}
