import { Student, StudentUpdate } from "@/lib/types/student";
import sseManager from "../sse";
import Mutex from "@/lib/utils/mutex";
import logger from "../logger";
import { unixTime } from "@/lib/utils/time";

const CHECK_INTERVAL = 2000; 
const HEARTBEAT_TIMEOUT = 15; 

class Network {
  private studentsMutex;
  private students: Map<string, Student> = new Map<string, Student>();
  private studentUpdates: Map<string, StudentUpdate> = new Map<string, StudentUpdate>();
  private heartbeats: Map<string, number> = new Map<string, number>();

  constructor() {
    this.studentsMutex = new Mutex();
    this.runner();
  }

  private runner() {
    this.callback().finally(() => {
      setTimeout(this.runner.bind(this), CHECK_INTERVAL);
    });
  }

  private async callback() {
    const unlock = await this.studentsMutex.lock();
    try {
      const now = await unixTime();
      const allIps = new Set([...this.students.keys(), ...this.heartbeats.keys()]);

      for (const ip of allIps) {
        const student = this.students.get(ip);
        const lastHeartbeat = this.heartbeats.get(ip) || 0;
        const isConnected = (now - lastHeartbeat) < HEARTBEAT_TIMEOUT;

        if (!student) {
          if (isConnected) {
            const newStudent: Student = { ip, name: "", connected: true, finished: false, since: now, attempts: 0, latestVersion: { hash: "", path: "" } };
            this.students.set(ip, newStudent);
            this.update(ip, newStudent);
            logger.warn(`New student connected: ${ip}`, { issuer: ip, action: "connected" });
          }
          continue;
        }
        
        if (student.connected !== isConnected) {
          if (isConnected === false && student.attempts < 3) {
            student.attempts++;
          } else {
            student.attempts = 0;
            this.update(ip, { ip, connected: isConnected, since: now });
            logger.warn(
              `Student ${student.name ? student.name : `${ip} (Unknown name)`} ${isConnected ? "reconnected" : "disconnected"}.`,
              { issuer: student.name ? student.name : ip, action: isConnected ? "reconnected" : "disconnected" }
            );
          }
        }
      }
    } finally {
      if (this.studentUpdates.size > 0) {
        sseManager.broadcast(Array.from(this.studentUpdates.values()), "state");
        this.studentUpdates.clear();
      }
      unlock();
    }
  }

  public async recordHeartbeat(ip: string) {
    this.heartbeats.set(ip, await unixTime());
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
    try {
      if (!this.students.has(ip)) {
        const now = await unixTime();
        const newStudent: Student = { ip, name: "", connected: false, finished: false, since: now, attempts: 0, latestVersion: { hash: "", path: "" } };
        this.students.set(ip, newStudent);
      }
      return this.students.get(ip)!;
    } finally {
      unlock();
    }
  }

  public async getStudents(): Promise<Student[]> {
    const unlock = await this.studentsMutex.lock();

    const students = Array.from(this.students.values());

    unlock();

    return students;
  }

  public async addUpdate(ip: string, update: StudentUpdate) {
    const unlock = await this.studentsMutex.lock();
    try {
      if (!this.students.has(ip)) {
        const now = await unixTime();
        const newStudent: Student = { ip, name: "", connected: false, finished: false, since: now, attempts: 0, latestVersion: { hash: "", path: "" } };
        this.students.set(ip, newStudent);
      }
      this.update(ip, update);
    } finally {
      unlock();
    }
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const network: Network = (globalThis as any).network || ((globalThis as any).network = new Network());

export default network;
