
import { describe, it, expect } from "vitest";

import { getIp } from "./network";
import type { Request } from "express";

describe("Network utils", () => {
  it("IP should be unknown when request has no IP", () => {
    const mockRequest = {
      headers: {
        "x-real-ip": undefined,
        "x-forwarded-for": undefined,
      },
      socket: {
        remoteAddress: undefined
      }
    } as unknown as Request

    expect(getIp(mockRequest)).toBe("unknown");
  })

  it("IP should be set when a request is processed", () => {
    const mockRequest = {
      headers: {
        "x-real-ip": "127.0.0.1",
      },
      socket: {},
    } as unknown as Request;

    expect(getIp(mockRequest)).toBe("127.0.0.1");
  });
})
