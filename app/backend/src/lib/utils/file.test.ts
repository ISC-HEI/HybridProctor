
import { describe, it, expect } from "vitest";

import { formatSize } from "./file";


describe("File Utils", () => {
  it("formatSize should return KB when small", () => {
    expect(formatSize(1000)).toBe("1.00 KB");
  });

  it("formatSize should return MB when medium", () => {
    expect(formatSize(1_000_000)).toBe("1.00 MB");
  });

  it("formatSize should return GB when large", () => {
    expect(formatSize(1_000_000_000)).toBe("1.00 GB");
  });
})
