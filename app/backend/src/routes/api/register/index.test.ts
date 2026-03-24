
import { loggerMock, networkMock, networkUtilsMock, setupIsolatedTests } from "@/setup_tests";
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/logger", () => ({
  default: loggerMock,
}));


vi.mock("@/lib/services/network", () => ({
  default: networkMock,
}));

// The handlers use getIp, so we need to mock it.
vi.mock("@/lib/utils/network", () => ({
  getIp: networkUtilsMock.getIp
}));

describe("/api/register", () => {
  setupIsolatedTests();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/register", () => {
    it("should respond with status:false when student isn't registered", async () => {
      const app = (await import("@/app")).default;

      networkMock.getStudentByName.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/register")
        .send({ name: "John Doe" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(false);
    });

    it("should respond with status:false when IP does not match", async () => {
      const app = (await import("@/app")).default;

      networkMock.getStudentByName.mockResolvedValue({ ip: "127.0.0.1" });
      networkUtilsMock.getIp.mockReturnValue("192.168.88.12");

      const res = await request(app)
        .post("/api/register")
        .send({ name: "John Doe" });

      expect(res.body.status).toBe(false);
    });
  });

  it("should respond with status:true when the user is registered", async () => {
    const app = (await import("@/app")).default;
    
    networkMock.getStudentByName.mockResolvedValue({ ip: "127.0.0.1" });
    networkUtilsMock.getIp.mockReturnValue("127.0.0.1");

    const res = await request(app)
      .post("/api/register")
      .send({ name: "John Doe" });

    expect(res.body.status).toBe(true);
  })

  describe("PATCH /api/register", () => {
    it("should warn and respond with 400 when a different IP tries to take a name", async () => {
      const app = (await import("@/app")).default;

      const existingStudent = {
        name: "Jane Doe",
        ip: "192.168.1.50",
      };

      networkMock.getStudentByName.mockResolvedValue(existingStudent);

      const res = await request(app)
        .patch("/api/register")
        .send({ surname: "Jane", name: "Doe" });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);

      expect(loggerMock.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ action: "Conflict" })
      );
    });
  });
});
