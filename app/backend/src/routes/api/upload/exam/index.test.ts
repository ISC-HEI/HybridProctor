
import { setupIsolatedTests, storageMock } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/storage", () => {
  return {
    default: storageMock
  }
})

describe("POST /api/upload/exam", () => {
  setupIsolatedTests();

  it("should write the exam", async () => {
    const app = (await import("@/app")).default;

    const response = await request(app)
      .post("/api/upload/exam")
      .attach("exam", Buffer.from("This is a test exam file"), "exam.html");

    expect(response.status).toBe(200);
    expect(storageMock.writeExam).toHaveBeenCalledOnce();
  });
});

