import { setupIsolatedTests } from "@/setup_tests";
import { describe, expect, it } from "vitest";
import request from "supertest";

describe("POST /api/lock", () => {
  setupIsolatedTests();

  it("should toggle the lock", async () => {
    const storage = (await import("@services/storage")).default;
    const app = (await import("@/app")).default;

    const previouslyLocked = storage.locked;

    const res = await request(app).post("/api/lock");

    expect(res.statusCode).toBe(200);

    expect(storage.locked).toBe(!previouslyLocked);
  });
})
