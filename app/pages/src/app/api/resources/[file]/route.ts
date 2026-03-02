import fs, { Stats } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import mime from 'mime-types';
import { ReadableOptions } from 'stream';


function streamFile(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);
  
  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk as unknown as ArrayBuffer)));
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string }> }
) {
  const { file } = await context.params;

  if (!file) {
    return NextResponse.json({ error: 'File not specified' }, { status: 400 });
  }

  try {
    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    const safePath = path.normalize(path.join(resourcesDir, file));

    if (!safePath.startsWith(resourcesDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const stats: Stats = await fs.promises.stat(safePath)
    const mimeType = mime.lookup(safePath) || 'application/octet-stream';

    const data: ReadableStream<Uint8Array> = streamFile(safePath);

    return new NextResponse(data, {
      status: 200,
        headers: new Headers({                                                          //Headers
            "content-disposition": `attachment; filename=${path.basename(file)}`,           //State that this is a file attachment
            "content-type": mimeType,                                              //Set the file type to an iso
            "content-length": stats.size + "",                                              //State the file size
        }),
    })

  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
