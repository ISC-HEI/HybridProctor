
import logger from "./logger";
import network from "./network";

export type SSEEvent = "log" | "state" | "error" | "std" | "init";

type Client = {
  ip: string;
  controller: ReadableStreamDefaultController;
  admin: boolean;
  signal: AbortSignal;
  intervalId?: NodeJS.Timeout;
};

class SSEManager {
  admins: Map<string, Client>;
  students: Map<string, Client>;
  encoder: TextEncoder;

  constructor() {
    this.admins = new Map<string, Client>();
    this.students = new Map<string, Client>();
    this.encoder = new TextEncoder();
  }

  private safeEnqueue(client: Client, event: SSEEvent, data: string) {
    if (client.signal.aborted) {
      this.removeClient(client.ip, client.admin);
      return;
    }

    try {
      client.controller.enqueue(this.encode(event, data));
    } catch (e) {
      logger.error(`Enqueue failed for ${client.ip}: ${(e as Error).message}`);
      this.removeClient(client.ip, client.admin);
    }
  }
  
  private safeEnqueueRaw(client: Client, message: string) {
    if (client.signal.aborted) {
      this.removeClient(client.ip, client.admin);
      return;
    }

    try {
      client.controller.enqueue(this.encoder.encode(message));
    } catch (e) {
      logger.error(`Raw enqueue failed for ${client.ip}: ${(e as Error).message}`);
      this.removeClient(client.ip, client.admin);
    }
  }

  public async addClient(ip: string, controller: ReadableStreamDefaultController, signal: AbortSignal, admin: boolean) {
    const client: Client = { ip, controller, admin, signal }; 

    const intervalId = setInterval(() => {
      this.safeEnqueueRaw(client, ": heartbeat\n\n");
    }, 15000);

    client.intervalId = intervalId;

    if (admin) {
      this.admins.set(ip, client);
    } else {
      this.students.set(ip, client);
    }

    this.safeEnqueue(client, "init", "Connecting...");

    if (admin) {
      this.safeEnqueue(client, "log", `${JSON.stringify({ message: logger.getLogs().slice(-20) })}`);
      this.safeEnqueue(client, "state", `${JSON.stringify({ message: await network.getStudents() })}`);
    } else {
      const student = await network.getStudent(ip);
      const storage = (await import("./storage")).default;

      this.safeEnqueue(client, "std", `${JSON.stringify({ message: { locked: storage.locked, finished: student.finished } })}`);
    }
  }

  public removeClient(ip: string, admin: boolean) {
    const client = admin ? this.admins.get(ip) : this.students.get(ip);
    if (client) {
      clearInterval(client.intervalId);
      if (admin) {
        this.admins.delete(ip);
      } else {
        this.students.delete(ip);
      }
    }
  }

  public broadcast(message: object, event: SSEEvent, admin: boolean = true) {
    const data = `${JSON.stringify({ message: message })}`;

    const clients = admin ? this.admins : this.students;
    for (const client of clients.values()) {
      this.safeEnqueue(client, event, data);
    }
  }

  public send(ip: string, message: object, event: SSEEvent, admin: boolean) {
    const data = `${JSON.stringify({ message: message })}`;
    const client = admin ? this.admins.get(ip) : this.students.get(ip);

    if (client) {
      this.safeEnqueue(client, event, data);
    }
  }

  public encode(event: SSEEvent, data: string) {
    return this.encoder.encode(`event: ${event}\ndata: ${data}\n\n`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());

export default sseManager;
