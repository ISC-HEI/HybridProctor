
import logger from "./logger";
import network from "./network";

export type SSEEvent = "log"|"state"|"error"|"std"|"init";

type Client = {
  ip: string;
  controller: ReadableStreamDefaultController;
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

  public async addClient(ip: string, controller: ReadableStreamDefaultController, admin: boolean) {
    if (admin) {
      this.admins.set(ip, { ip, controller });
    }
    else {
      this.students.set(ip, { ip, controller });
    }

    if (admin) {
      controller.enqueue(this.encode("log", `${JSON.stringify({ message: logger.getLogs().slice(-20) })}`));
      controller.enqueue(this.encode("state", `${JSON.stringify({ message: await network.getStudents() })}`));

      return;
    }

    const student = await network.getStudent(ip);
    const storage = (await import("./storage")).default;

    controller.enqueue(this.encode("std", `${JSON.stringify({ message: { locked: storage.locked, finished: student.finished } })}`))
  }

  public removeClient(ip: string, admin: boolean) {
    if (admin) {
      this.admins.delete(ip);
    }
    else {
      this.students.delete(ip);
    }
  }

  public broadcast(message: object, event: SSEEvent, admin: boolean = true) {
    const data = this.encode(event, `${JSON.stringify({ message: message })}`);

    if (admin) {
      for (const ip of this.admins.keys()) {
        const client = this.admins.get(ip);
        
        client?.controller.enqueue(data);
      }
      return;
    }

    for (const ip of this.students.keys()) {
      const client = this.students.get(ip);

      client?.controller.enqueue(data);
    }
  }

  public send(ip: string, message: object, event: SSEEvent, admin: boolean) {
    const data = this.encode(event, `${JSON.stringify({ message: message })}`);

    const client = admin ? this.admins.get(ip) : this.students.get(ip);

    if (!client) {
      return;
    }

    client.controller.enqueue(data);
  }

  public encode(event: SSEEvent, data: string) {
    return this.encoder.encode(`event: ${event}\ndata: ${data}\n\n`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());

export default sseManager;
