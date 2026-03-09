
import { describe, it, expect } from "vitest";

import { getIp } from "./network";
import { runWithRequest } from "./requestContext";
import type { Request } from "express";

describe("Network utils", () => {
  it("IP should be unknown when no request is processed", async () => {
    await expect(getIp()).resolves.toBe("unknown");
  })

  it("IP should be set when a request is processed", async () => {
    const mockRequest = {
      headers: {
        "x-real-ip": "127.0.0.1",
      },
      socket: {},
    } as unknown as Request;
    await runWithRequest(mockRequest, async () => {
      await expect(getIp()).resolves.toBe("127.0.0.1");
    });
  });
})
