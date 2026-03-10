import { setupIsolatedTests } from "@/setup_tests";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/utils/network", () => ({
  getIp: vi.fn().mockResolvedValue("127.0.0.1"),
}));

const mockSseManager = {
  addClient: vi.fn(),
  removeClient: vi.fn(),
};
vi.mock("@services/sse", () => ({
  default: mockSseManager,
}));

const mockStorage = {
  verifySession: vi.fn(),
};
vi.mock("@services/storage", () => ({
  default: mockStorage,
}));

describe("/api/sse", () => {
  describe("GET /api/sse/admin", () => {
    setupIsolatedTests();

    it("should send an unauthorized error if session is invalid", async () => {
      const app = (await import("@/app")).default;
      mockStorage.verifySession.mockResolvedValue(false);

      const res = await request(app).get("/api/sse/admin").set("Cookie", "sid=123");

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("text/event-stream");
      expect(res.text).toContain('event: error\ndata: {"message":"Unauthorized"}');
    });
  });
});
