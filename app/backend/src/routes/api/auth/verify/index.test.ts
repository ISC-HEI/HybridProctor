
import { loggerMock, storageMock, setupIsolatedTests } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import dayjs from "dayjs";

vi.mock("@/lib/services/logger", () => {
  return {
    default: loggerMock 
  };
});

vi.mock("@/lib/services/storage", () => ({
  default: storageMock,
}));


const password = "123";
const timestamp = dayjs().toISOString();

describe("POST /api/auth/verify", () => {
  setupIsolatedTests();

  it("should redirect to / when the password is incorrect", async () => {
    const app = (await import("@/app")).default;

    storageMock.verifyPassword.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/verify").send({ password, timestamp });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ redirect: "/" });
  });

  it("should create a session and redirect to the desired URL on correct password", async () => {
    const app = (await import("@/app")).default;
    const desiredUrl = "/some-protected-page";

    storageMock.verifyPassword.mockResolvedValue(true);
    storageMock.createSession.mockResolvedValue("new-session-id");

    const res = await request(app)
      .post("/api/auth/verify")
      .send({ password, timestamp })
      .set("Cookie", `desired_url=${desiredUrl}`);

    expect(res.statusCode).toBe(200);
    expect(storageMock.setOffset).toHaveBeenCalledWith(timestamp);
    expect(storageMock.createSession).toHaveBeenCalled();
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"]?.[0]).toContain("sid=new-session-id");
    expect(res.body).toEqual({ redirect: desiredUrl });
  });
})
