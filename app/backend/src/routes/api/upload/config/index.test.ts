
import { setupIsolatedTests, storageMock } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/storage", () => {
  return {
    default: storageMock
  }
});

describe("POST /api/upload/config", () => {
  setupIsolatedTests();

  it("should write the config", async () => {
    const app = (await import("@/app")).default;

    const config = {};

    await request(app).post("/api/upload/config").send({ config });

    expect(storageMock.writeConfig).toHaveBeenCalledWith(config);
  })
});
