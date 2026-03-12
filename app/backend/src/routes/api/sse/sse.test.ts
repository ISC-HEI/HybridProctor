import { networkUtilsMock, setupIsolatedTests, sseManagerMock, storageMock } from "@/setup_tests";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";


vi.mock("@/lib/utils/network", () => {
  return networkUtilsMock 
});

vi.mock("@services/sse", () => ({
  default: sseManagerMock,
}));

vi.mock("@services/storage", () => ({
  default: storageMock,
}));

describe("/api/sse", () => {
  describe("GET /api/sse/admin", () => {
    setupIsolatedTests();

    it("should send an unauthorized error if session is invalid", async () => {
      const app = (await import("@/app")).default;
      storageMock.verifySession.mockResolvedValue(false);
      networkUtilsMock.getIp.mockResolvedValue("127.0.0.1");

      const res = await request(app).get("/api/sse/admin").set("Cookie", "sid=123");

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("text/event-stream");
      expect(res.text).toContain('event: error\ndata: {"message":"Unauthorized"}');
    });
  });
});
