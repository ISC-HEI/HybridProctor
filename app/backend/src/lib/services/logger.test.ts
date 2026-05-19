
import storage from "@services/storage";
import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";
import { describe, expect, it, vi, beforeEach, assert } from "vitest";

let logger: Awaited<typeof import("@services/logger")>["default"];
storage.setOffset(dayjs().toISOString())

describe("Logger service", () => {

  beforeEach(async () => {
    delete (globalThis as any).storage;

    vi.resetModules();

    const loggerModule = await import("@services/logger");
    logger = loggerModule.default;
  })

  it("should create a file", async () => {
    await logger.info("Test log");

    try {
      const stats = await fs.stat(path.join(process.env.LOG_PATH as string, "latest.log"));

      expect(stats.mtime.getTime()).toBeGreaterThan(Date.now() - 5000);
    } catch {
      assert.fail();
    }
  })

  it("should add a log to its array", async () => {
    await logger.info("Test log");

    const logs = logger.getLogs();

    expect(logs.length).toBeGreaterThan(0);
  })
})
