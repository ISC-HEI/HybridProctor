
import sseManager from "@services/sse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  await sseManager.addClient(writer);

  req.signal.addEventListener("abort", () => {
    sseManager.removeClient(writer);
    writer.close();
  })

  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    }
  })
}
