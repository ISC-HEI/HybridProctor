
import { describe, it, expect, beforeAll, vi } from "vitest";

vi.mock(import("@services/storage"), { spy: true });

describe("Storage service", () => {
  let storageService: any;

  beforeAll(async () => {
    storageService = (await import("@services/storage")).default;
  })

  it("should throw an error if init() is called more than once", async () => {
    // storage.init() is already called once when the module is first imported.
    // Calling it a second time should be rejected.
    await expect(storageService.init()).rejects.toThrow("Storage already initialized!");
  });
})
