
import { describe, it, expect, vi, beforeEach } from "vitest";

import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

let storage: Awaited<typeof import("@services/storage")>["default"];

describe("Storage service", () => {

  beforeEach(async () => {
    delete (globalThis as any).storage;

    vi.resetModules();

    const storageModule = await import("@services/storage");
    storage = storageModule.default;

    storage.setOffset(dayjs().toISOString());
  })

  it("should throw an error if init() is called more than once", async () => {
    await expect(storage.init()).rejects.toThrow(
      "Storage already initialized!",
    );
  });

  it("shouldn't read private directories", async () => {
    await expect(storage.readDir("/..")).resolves.toBe(false);
  });

  it("should create a session", async () => {
    await expect(storage.createSession("127.0.0.1")).resolves.toBeTypeOf("string");
  });

  it ("should identify a session", async () => {
    const sid = await storage.createSession("127.0.0.1");

    await expect(storage.verifySession(sid, "127.0.0.1")).resolves.toBe(true);
  });

  it("shouldn't identify a session that doesn't exist", async () => {
    await expect(storage.verifySession(uuid(), "127.0.0.1")).resolves.toBe(false);
  });

  it("shouldn't identify a session that isn't yours", async () => {
    const sid1 = await storage.createSession("127.0.0.1");
    await storage.createSession("192.168.1.128");

    await expect(storage.verifySession(sid1, "192.168.1.128")).resolves.toBe(false);
  });
});
