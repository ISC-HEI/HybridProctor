
import { setupIsolatedTests, setupStorage } from "@/setup_tests";
import { describe, it, expect } from "vitest";
import request from "supertest";


const ip = "127.0.0.1";

describe("POST /api/hash", () => {
  setupIsolatedTests();

  it("should verify the hash", async () => {
    setupStorage();

    const app = (await import("@/app")).default;
    const network = (await import("@services/network")).default;

    const hash = "123"

    let student = await network.getStudent(ip);

    student.latestVersion.hash = hash;
    
    const res = await request(app).post("/api/hash").send({ hash });

    expect(res.statusCode).toBe(200);

    student = await network.getStudent(ip);

    expect(student.finished).toBe(true);
  });

  it("shouldn't accept an invalid hash", async () => {
    setupStorage();

    const app = (await import("@/app")).default;
    const network = (await import("@services/network")).default;

    const hash = "123"

    let student = await network.getStudent(ip);

    student.latestVersion.hash = "789";

    const res = await request(app).post("/api/hash").send({ hash });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("This hash isn't the latest one.");
  });
})
