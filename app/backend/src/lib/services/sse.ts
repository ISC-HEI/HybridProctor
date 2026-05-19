import { appState } from "../state";
import logger from "./logger";
import network from "./network";
import { type Response } from "express";

export type SSEEvent = "log" | "state" | "error" | "std" | "init";

type Client = {
  ip: string;
  res: Response;
  admin: boolean;
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

  private safeWrite(client: Client, event: SSEEvent, data: any) {
    try {
      client.res.write(`event: ${event}
data: ${JSON.stringify({ message: data })}

`);
    } catch (e) {
      logger.error(`Failed to send SSE to ${client.ip}.`);
      console.error(e);
      this.removeClient(client.ip, client.admin);
    }
  }

  public async addClient(ip: string, res: Response, admin: boolean) {
    const client: Client = { ip, res, admin }; 

    const intervalId = setInterval(() => {
      try {
        res.write(`: heartbeat

`);
      } catch {
        this.removeClient(ip, admin);
      }
    }, 15000);

    client.intervalId = intervalId;

    if (admin) {
      this.admins.set(ip, client);
    } else {
      this.students.set(ip, client);
    }

    if (admin) {
      this.safeWrite(client, "log", logger.getLogs().slice(-20));
      this.safeWrite(client, "init", await network.getStudents());
    } else {
      const student = await network.getStudent(ip);

      this.safeWrite(client, "init", "Connecting...");
      this.safeWrite(client, "std", { locked: appState.locked, finished: student.finished });
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

      try {
        client.res.end();
      } catch {}
    }
  }

  public broadcast(message: object, event: SSEEvent, admin: boolean = true) {
    const clients = admin ? this.admins : this.students;
    for (const client of clients.values()) {
      this.safeWrite(client, event, message);
    }
  }

  public send(ip: string, message: object, event: SSEEvent, admin: boolean) {
    const client = admin ? this.admins.get(ip) : this.students.get(ip);

    if (client) {
      this.safeWrite(client, event, message);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sseManager: SSEManager = (globalThis as any).sseManager || ((globalThis as any).sseManager = new SSEManager());

export default sseManager;
