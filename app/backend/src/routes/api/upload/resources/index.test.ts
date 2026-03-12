
import { setupIsolatedTests, storageMock } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/storage", () => ({ default: storageMock }));

describe("POST /api/upload/resources", () => {
  setupIsolatedTests();

  it("should write resources", async () => {
    const app = (await import("@/app")).default;

    const res = await request(app).post("/api/upload/resources");

    expect(res.statusCode).toBe(200);
    expect(storageMock.writeResources).toHaveBeenCalled();
  });
})
