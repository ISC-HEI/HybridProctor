import { Student, StudentUpdate } from "@/lib/types/student";
import sseManager from "../sse";
import Mutex from "@/lib/utils/mutex";
import logger from "../logger";

const INTERVAL = 2000;
const IPS_ROUTE = "/ip/dhcp-server/lease/print";
const PING_ROUTE = "/ping"
const IP_REGEX = /(10\.32\.9\..{1,3})|(172\.17\.0\..{1,3})|(.{1,3}\..{1,3}\..{1,3}\.[01])/g

class Network {
  private api: string;
  private studentsMutex;
  private students: Map<string, Student> = new Map<string, Student>();
  private studentUpdates: Map<string, StudentUpdate> = new Map<string, StudentUpdate>();

  constructor() {
    if (!process.env.IP || !process.env.MIKROTIK_USER) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.api = `http://${process.env.IP}/rest`;

    this.studentsMutex = new Mutex();
    
    setInterval(this.callback.bind(this), INTERVAL);
  }

  private async callback() {
    const unlock = await this.studentsMutex.lock();
    
    const headers = new Headers();

    headers.set("Authorization", `Basic ${Buffer.from(`${process.env.MIKROTIK_USER}:${process.env.MIKROTIK_PASSWORD}`, "utf8").toString("base64")}`);

    const res = await fetch(this.api + IPS_ROUTE, {
      method: "POST",
      headers: headers,
    });

    const connections = await res.json();

    const connectedIps = new Set<string>();

    for (const conn of connections) {
      const address = conn["address"];

      if (address && !address.match(IP_REGEX)) {
        const pingHeaders = new Headers();

        pingHeaders.set("Authorization", `Basic ${Buffer.from(`${process.env.MIKROTIK_USER}:${process.env.MIKROTIK_PASSWORD}`, "utf8").toString("base64")}`);
        pingHeaders.set("Content-Type", "application/json");
        pingHeaders.set("Accept", "application/json");

        try {
          const res = await fetch(this.api + PING_ROUTE, {
            method: "POST",
            headers: pingHeaders,
            body: JSON.stringify({ address: address, count: "1" })
          });

          const data = await res.json();

          if (data[0] && data[0].received === '1') {
            connectedIps.add(address);
          }
        }
        catch (e) {
          logger.error("Cannot send ping command to router.");
        }
      }
    }

    for (const [ip, student] of this.students) {
      let connected = true;

      if (!connectedIps.has(ip)) {
        connected = false;
      }

      if (student && connected !== student.connected) {
        if (connected === false && student.attempts < 1) {
          student.attempts++;
        }
        else {
          student.attempts = 0;

          const since = Date.now();

          this.update(ip, { ip, connected, since });

          logger.warn(
            `Student ${student.name ? student.name : `${student.ip} (Unknown name)`} ${connected ? "reconnected" : "deconnected"}.`,
            { issuer: student.name ? student.name : student.ip, action: connected ? "reconnected" : "deconnected" }
          );
        }
      }
    }

    for (const studentIp of connectedIps) {
      if (!this.students.has(studentIp)) {
        this.addNewStudent(studentIp);
      }
    }


    if (this.studentUpdates.size > 0) {
      sseManager.broadcast(Array.from(this.studentUpdates.values()), "state");
    }

    this.studentUpdates.clear();

    unlock();
  }

  private async addNewStudent(ip: string) {
    const unlock = await this.studentsMutex.lock();

    const student = { ip, name: "", connected: true, allFilesSent: false, since: Date.now(), attempts: 0 };
    this.students.set(ip, student);
    this.studentUpdates.set(ip, student);

    unlock();
  }

  private update(ip: string, update: StudentUpdate) {
    if (!this.studentUpdates.has(ip)) {
      this.studentUpdates.set(ip, update);
    }
    else {
      this.studentUpdates.set(ip, { ...this.studentUpdates.get(ip), ...update });
    }

    this.students.set(ip, { ...this.students.get(ip)!, ...this.studentUpdates.get(ip) });
  }

  public async getStudent(ip: string): Promise<Student> {
    const unlock = await this.studentsMutex.lock();

    if (!this.students.has(ip)) {
      this.addNewStudent(ip);
    }

    const student = this.students.get(ip)!;

    unlock();

    return student;
  }

  public async getStudents(): Promise<Student[]> {
    const unlock = await this.studentsMutex.lock();

    const students = Array.from(this.students.values());

    unlock();

    return students;
  }

  public async addUpdate(ip: string, update: StudentUpdate) {
    this.getStudent(ip);

    const unlock = await this.studentsMutex.lock();

    this.update(ip, update);

    unlock();
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const network: Network = (globalThis as any).network || ((globalThis as any).network = new Network());

export default network;
