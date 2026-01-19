import { NextRequest, NextResponse } from "next/server";
import network from "@/lib/services/network";
import { getIp } from "@/lib/utils/network";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = await getIp();
    if (!ip) {
      // Cannot identify client, but we can't do much.
      // Return a 204 so the client doesn't log an error.
      return new NextResponse(null, { status: 204 });
    }
    
    await network.recordHeartbeat(ip); 
    
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    // Log the error but don't fail, as this is a background task.
    console.error("Heartbeat error:", error);
    return new NextResponse(null, { status: 204 });
  }
}
