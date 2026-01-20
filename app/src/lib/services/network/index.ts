import { Student, StudentUpdate } from "@/lib/types/student";
import sseManager from "../sse";
import Mutex from "@/lib/utils/mutex";
import logger from "../logger";
import { unixTime } from "@/lib/utils/time";

const CHECK_INTERVAL = 2000; 
const HEARTBEAT_TIMEOUT = 10; 

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
      for (const [ip, student] of this.students) {
        const lastHeartbeat = this.heartbeats.get(ip) || 0;
        const isConnected = (await unixTime() - lastHeartbeat) < HEARTBEAT_TIMEOUT;

        console.log(lastHeartbeat, await unixTime());
        console.log((await unixTime() - lastHeartbeat), HEARTBEAT_TIMEOUT)

        if (student.connected !== isConnected) {
          if (isConnected === false && student.attempts < 1) {
            student.attempts++;
          } else {
            student.attempts = 0;
            const since = await unixTime();
            this.update(ip, { ip, connected: isConnected, since });

            logger.warn(
              `Student ${student.name ? student.name : `${student.ip} (Unknown name)`} ${isConnected ? "reconnected" : "disconnected"}.`,
              { issuer: student.name ? student.name : student.ip, action: isConnected ? "reconnected" : "disconnected" }
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
    const unlock = await this.studentsMutex.lock();
    try {
      this.heartbeats.set(ip, await unixTime());

      if (!this.students.has(ip)) {
        const student: Student = { ip, name: "", connected: true, finished: false, since: await unixTime(), attempts: 0, latestVersion: { hash: "", path: "" } };
        this.students.set(ip, student);
        this.studentUpdates.set(ip, student);

      } else {
        const student = this.students.get(ip)!;
        if (!student.connected) {
            student.attempts = 0;
            const since = await unixTime();
            this.update(ip, { ip, connected: true, since });
             logger.warn(
              `Student ${student.name ? student.name : `${student.ip} (Unknown name)`} reconnected.`,
              { issuer: student.name ? student.name : student.ip, action: "reconnected" }
            );
        }
      }
    } finally {
      unlock();
    }
  }

  private async addNewStudent(ip: string) {
    const student: Student = { ip, name: "", connected: true, finished: false, since: await unixTime(), attempts: 0, latestVersion: { hash: "", path: "" } };
    this.students.set(ip, student);
    this.studentUpdates.set(ip, student);
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
      await this.addNewStudent(ip);
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
