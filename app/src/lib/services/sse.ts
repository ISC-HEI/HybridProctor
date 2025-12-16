
import logger from "./logger";
import network from "./network";

export type SSEEvent = "log"|"state"|"error";

class SSEManager {
  clients: ReadableStreamDefaultController[];
  encoder: TextEncoder;
  
  constructor() {
    this.clients = [];
    this.encoder = new TextEncoder();
  }

  public async addClient(controller: ReadableStreamDefaultController) {
    this.clients.push(controller);
    
    controller.enqueue(this.encode("log", `${JSON.stringify({ message: logger.getLogs().slice(-20) })}`));
    controller.enqueue(this.encode("state", `${JSON.stringify({ message: await network.getStudents() })}`));
  }

  public removeClient(controller: ReadableStreamDefaultController) {
    const idx = this.clients.indexOf(controller);
    if (idx !== -1) {
      this.clients.splice(idx, 1);
    }
  }

  public broadcast(message: object, event: SSEEvent) {
    const data = this.encode(event, `${JSON.stringify({ message: message })}`);

    for (const controller of this.clients) {
      controller.enqueue(data);
    }
  }

  public encode(event: string, data: string) {
    return this.encoder.encode(`event: ${event}\ndata: ${data}\n\n`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());

export default sseManager;
