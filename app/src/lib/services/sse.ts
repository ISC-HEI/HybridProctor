
import logger from "./logger";
import network from "./network";

export type SSEEvent = "log"|"state";

class SSEManager {
  clients: WritableStreamDefaultWriter<Uint8Array>[];
  encoder: TextEncoder;
  
  constructor() {
    this.clients = [];
    this.encoder = new TextEncoder();
  }

  public async addClient(writer: WritableStreamDefaultWriter<Uint8Array>) {
    this.clients.push(writer);
    writer.write(this.encoder.encode("event: log\n"));
    writer.write(this.encoder.encode(`data: ${JSON.stringify({ message: logger.getLogs() })}\n\n`));
    writer.write(this.encoder.encode("event: state\n"));
    writer.write(this.encoder.encode(`data: ${JSON.stringify({ message: await network.getStudents() })}\n\n`));
  }

  public removeClient(writer: WritableStreamDefaultWriter<Uint8Array>) {
    const idx = this.clients.indexOf(writer);
    if (idx !== -1) {
      this.clients.splice(idx, 1);
    }
  }

  public broadcast(message: object, event: SSEEvent) {
    const evt = this.encoder.encode(`event: ${event}\n`);
    const data = this.encoder.encode(`data: ${JSON.stringify({ message: message })}\n\n`);
    
    for (const writer of this.clients) {
      writer.write(evt).catch(() => {})
      writer.write(data).catch(() => {});
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());

export default sseManager;
