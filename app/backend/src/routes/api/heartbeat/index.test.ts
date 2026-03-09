
import { describe, expect, it } from "vitest";
import request from "supertest";
import { setupIsolatedTests, setupStorage } from "@/setup_tests";
import dayjs from "dayjs";

describe("POST /api/heartbeat", () => {
  setupIsolatedTests();

  it("should should record a new heartbeat", async () => {
    await setupStorage();

    const network = (await import("@services/network")).default;
    const app = (await import("@/app")).default;

    const res = await request(app).post("/api/heartbeat");

    expect(res.statusCode).toBe(204);

    const heartbeat: number = network.heartbeats.get("127.0.0.1")!;

    expect(heartbeat).toBeGreaterThan(dayjs().unix() - 5000);
  })
})
