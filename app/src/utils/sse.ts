import logger, { LogLine } from "./logger";

class SSEManager {
  clients: WritableStreamDefaultWriter<Uint8Array>[];
  encoder: TextEncoder;
  
  constructor() {
    this.clients = [];
    this.encoder = new TextEncoder();
  }

  public async addClient(writer: WritableStreamDefaultWriter<Uint8Array>) {
    this.clients.push(writer);
    writer.write(this.encoder.encode(`data: ${JSON.stringify({ message: await logger.read() })}\n\n`))
  }

  public removeClient(writer: WritableStreamDefaultWriter<Uint8Array>) {
    const idx = this.clients.indexOf(writer);
    if (idx !== -1) {
      this.clients.splice(idx, 1);
    }
  }

  public broadcast(message: LogLine) {
    const data = this.encoder.encode(`data: ${JSON.stringify({ message: [message] })}\n\n`);
    
    for (const writer of this.clients) {
      writer.write(data).catch(() => {});
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());
