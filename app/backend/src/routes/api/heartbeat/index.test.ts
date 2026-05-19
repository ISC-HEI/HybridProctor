
import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { networkMock, setupIsolatedTests, setupStorage } from "@/setup_tests";

vi.mock("@/lib/services/network", () => ({
  default: networkMock
}))

describe("POST /api/heartbeat", () => {
  setupIsolatedTests();

  it("should should record a new heartbeat", async () => {
    await setupStorage();

    const app = (await import("@/app")).default;

    const res = await request(app).post("/api/heartbeat");

    expect(res.statusCode).toBe(204);

    expect(networkMock.recordHeartbeat).toHaveBeenCalled();
  })
})
