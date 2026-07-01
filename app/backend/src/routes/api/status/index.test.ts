
import { loggerMock, networkMock, setupIsolatedTests, sseManagerMock } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/logger", () => {
  return {
    default: loggerMock
  }
});

vi.mock("@/lib/services/network", () => {
  return {
    default: networkMock
  }
});

vi.mock("@/lib/services/sse", () => {
  return {
    default: sseManagerMock
  }
})

describe("POST /api/status", () => {
  setupIsolatedTests();

  it("should change the finished status of a the student", async () => {
    const app = (await import("@/app")).default;
    
    const student = {
      ip: "127.0.0.1",
      finished: true
    }

    await request(app).post("/api/status").send({ student });

    expect(networkMock.addUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ finished: false })
    )
  })
})
