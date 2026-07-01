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

  /**
   * Writes an SSE event frame to a client. Removes the client on write failure.
   * @param client - The target SSE client.
   * @param event - The event name.
   * @param data - The data payload to send.
   */
  private safeWrite(client: Client, event: SSEEvent, data: any) {
    try {
      client.res.write(`event: ${event}\ndata: ${JSON.stringify({ message: data })}\n\n`);
    } catch (e) {
      logger.error(`Failed to send SSE to ${client.ip}.`);
      this.removeClient(client.ip, client.admin);
    }
  }

  /**
   * Registers a new SSE client and starts a heartbeat interval (10s) to keep the connection alive.
   * On first connect, sends the appropriate initialisation data (log history for admins,
   * connection signal for students).
   * @param ip - The client IP address.
   * @param res - The Express response object.
   * @param admin - Whether the client is an admin.
   */
  public async addClient(ip: string, res: Response, admin: boolean) {
    const client: Client = { ip, res, admin }; 

    const intervalId = setInterval(async () => {
      try {
        res.write(`: heartbeat\n\n`);
      } catch {
        const student = await network.getStudent(ip);
        logger.warn(`SSE heartbeat couldn't been send to ${student.name || student.ip}`)

        this.removeClient(ip, admin);
      }
    }, 10000);

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

  /**
   * Deregisters an SSE client, clears its heartbeat interval, and ends the response.
   * @param ip - The client IP address.
   * @param admin - Whether the client is an admin.
   */
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

  /**
   * Sends an event to all connected clients of a given type (admin or student).
   * @param message - The data to send.
   * @param event - The event name.
   * @param [admin=true] - Broadcast to admin clients (true) or student clients (false).
   */
  public broadcast(message: object, event: SSEEvent, admin: boolean = true) {
    const clients = admin ? this.admins : this.students;
    for (const client of clients.values()) {
      this.safeWrite(client, event, message);
    }
  }

  /**
   * Sends an event to a single client identified by IP address.
   * @param ip - The client IP address.
   * @param message - The data to send.
   * @param event - The event name.
   * @param admin - Whether the target is an admin client.
   */
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
