import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { Readable } from "stream";
import { fsMock, loggerMock, setupIsolatedTests } from "@/setup_tests";

vi.mock("fs", () => ({
  createReadStream: fsMock.createReadStream,
  promises: fsMock.promises,
  default: fsMock,
  existsSync: fsMock.existsSync
}));

vi.mock("mime-types", () => ({
  default: {
    lookup: vi.fn(),
  },
}));

vi.mock("@/lib/services/logger", () => ({
  default: loggerMock
}));

// We need to import the mocked modules *after* the vi.mock calls
const mime = await import("mime-types");
const logger = (await import("@/lib/services/logger")).default;

describe("GET /api/resources/:file", () => {
  setupIsolatedTests();

  it("should return 400 for invalid file paths (path traversal)", async () => {
    const app = (await import("@/app")).default;
    const res = await request(app).get("/api/resources/../../secrets.txt");

    expect(res.status).toBe(302);
  });

  it("should return 404 if fs.promises.stat throws an error", async () => {
    const app = (await import("@/app")).default;
    fsMock.promises.stat.mockRejectedValue(new Error("File not found"));

    const res = await request(app).get("/api/resources/non-existent-file.jpg");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "File not found" });
  });

  it("should stream the file with correct headers on success", async () => {
    const app = (await import("@/app")).default;
    const fileContent = "mock-image-content";
    const fileName = "test-image.png";

    fsMock.promises.stat.mockResolvedValue({ size: fileContent.length } as any);
    vi.mocked(mime.default.lookup).mockReturnValue("text/plain");

    const mockReadStream = new Readable();
    mockReadStream.push(fileContent);
    mockReadStream.push(null); // End of stream
    fsMock.createReadStream.mockReturnValue(mockReadStream as any);

    const res = await request(app).get(`/api/resources/${fileName}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/plain");
    expect(res.headers["content-length"]).toBe(fileContent.length.toString());
    expect(res.headers["content-disposition"]).toBe(`attachment; filename=${fileName}`);
    expect(res.text).toBe(fileContent);

    expect(fsMock.promises.stat).toHaveBeenCalledWith(
      expect.stringMatching(/public[\\\/]resources[\\\/]test-image\.png$/)
    );
  });

  it("should handle errors during stream piping", async () => {
    const app = (await import("@/app")).default;
    const fileName = "bad-stream.txt";
    const streamError = new Error("Something went wrong during read");

    fsMock.promises.stat.mockResolvedValue({ size: 123 } as any);
    vi.mocked(mime.default.lookup).mockReturnValue("text/plain");

    const mockReadStream = new Readable({
      read() {
        this.emit("error", streamError);
      },
    });
    fsMock.createReadStream.mockReturnValue(mockReadStream as any);

    const res = await request(app).get(`/api/resources/${fileName}`);

    expect(res.status).toBe(500);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error streaming file`),
    );
  });
});
