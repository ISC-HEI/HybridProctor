import { NextRequest, NextResponse } from "next/server";
import path from "path";
import os from "os";
import fs from "fs";
import { PassThrough } from "stream";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sanitizedId = path.basename(id);

  if (sanitizedId !== id) {
    return new NextResponse("Invalid file ID", { status: 400 });
  }
  
  const tempPath = path.join(os.tmpdir(), sanitizedId);

  try {
    if (!fs.existsSync(tempPath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    const stat = fs.statSync(tempPath);
    const dataStream = fs.createReadStream(tempPath);
    const passThrough = new PassThrough();

    dataStream.pipe(passThrough);

    dataStream.on("end", () => {
      fs.unlink(tempPath, (err) => {
        if (err) {
          console.error(`Failed to delete temp file ${tempPath}`, err);
        }
      });
    });

    dataStream.on("error", (err) => {
        console.error(`Error reading temp file ${tempPath}`, err);
        passThrough.end();
    });

    const res = new NextResponse(passThrough as any, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Length": stat.size.toString(),
            "Content-Disposition": `attachment; filename="download.zip"`,
        }
    });

    return res;

  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
