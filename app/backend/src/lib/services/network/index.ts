import { type Student, type StudentUpdate } from "@/lib/types/student";
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

  /**
   * Creates the mutex and starts the periodic heartbeat-check loop.
   */
  constructor() {
    this.studentsMutex = new Mutex();
    this.runner();
  }

  /**
   * Creates and stores a new Student entry with default values.
   * @param ip - The student's IP address.
   * @param time - The timestamp of first connection.
   * @returns The newly created student.
   */
  private createStudent(ip: string, time: number) {
    const newStudent: Student = { ip, name: "", connected: true, hasInternet: false, sent: false, finished: false, since: time, attempts: 0, hidden: false, latestVersion: { hash: "", path: "" } };

    this.students.set(ip, newStudent);

    return newStudent
  }

  /**
   * Creates a student entry for the given IP only if one does not already exist.
   * @param ip - The student's IP address.
   */
  private createStudentIfNotExists(ip: string) {
    if (this.students.has(ip)) return;

    const now = unixTime();

    this.createStudent(ip, now);
  }

  /**
   * Schedules the periodic heartbeat-check loop at CHECK_INTERVAL (2s).
   */
  private runner() {
    this.callback().finally(() => {
      setTimeout(this.runner.bind(this), CHECK_INTERVAL);
    });
  }

  /**
   * Iterates all known IPs, checks heartbeat freshness, updates connection state,
   * and broadcasts pending student updates via SSE.
   * Connection-loss events are debounced up to 3 attempts before triggering.
   */
  private async callback() {
    const unlock = await this.studentsMutex.lock();
    try {
      const now = unixTime();
      const allIps = new Set([...this.students.keys(), ...this.heartbeats.keys()]);

      for (const ip of allIps) {
        const student = this.students.get(ip);
        const lastHeartbeat = this.heartbeats.get(ip) || 0;
        const isConnected = (now - lastHeartbeat) < HEARTBEAT_TIMEOUT;

        if (!student) {
          if (isConnected) {
            const newStudent = this.createStudent(ip, now);
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

  /**
   * Records a heartbeat timestamp for the given IP, used to determine connection state.
   * @param ip - The student's IP address.
   */
  public async recordHeartbeat(ip: string) {
    this.heartbeats.set(ip, unixTime());
  }

  /**
   * Queues a partial student update for batch broadcast and applies it to the in-memory student record.
   * @param ip - The student's IP address.
   * @param update - The partial update to apply.
   */
  private update(ip: string, update: StudentUpdate) {
    if (!this.studentUpdates.has(ip)) {
      this.studentUpdates.set(ip, update);
    }
    else {
      this.studentUpdates.set(ip, { ...this.studentUpdates.get(ip), ...update });
    }

    this.students.set(ip, { ...this.students.get(ip)!, ...this.studentUpdates.get(ip) });
  }

  /**
   * Returns the student for a given IP address, creating one if absent.
   * @param ip - The student's IP address.
   * @returns The student record.
   */
  public async getStudent(ip: string): Promise<Student> {
    const unlock = await this.studentsMutex.lock();
    try {
      this.createStudentIfNotExists(ip);

      return this.students.get(ip)!;
    } finally {
      unlock();
    }
  }

  /**
   * Finds a student by their registered name. Logs an error if duplicates exist (returns the last match).
   * @param name - The student's full name.
   * @returns The matching student, or undefined.
   */
  public async getStudentByName(name: string) {
    const unlock = await this.studentsMutex.lock();

    const students = Array.from(this.students.values()).filter(v => v.name === name);

    unlock();

    const length = students.length

    if (length === 1) {
      return students[0];
    }

    if (length > 1) {
      logger.error(`${length} students have the same name !`)
      return students[length - 1];
    }

    return undefined;
  }

  /**
   * Returns all tracked students.
   * @returns Array of all students.
   */
  public async getStudents(): Promise<Student[]> {
    const unlock = await this.studentsMutex.lock();

    const students = Array.from(this.students.values());

    unlock();

    return students;
  }

  /**
   * Atomically applies a partial update to a student. Creates the student first if it does not exist.
   * @param update - The partial update to apply.
   */
  public async addUpdate(update: StudentUpdate) {
    const unlock = await this.studentsMutex.lock();
    try {
      const ip = update.ip;

      this.createStudentIfNotExists(ip);
      
      this.update(ip, update);
    } finally {
      unlock();
    }
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const network: Network = (globalThis as any).network || ((globalThis as any).network = new Network());

export default network;
