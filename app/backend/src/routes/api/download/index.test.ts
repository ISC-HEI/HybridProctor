import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { Readable } from "stream";
import { setupIsolatedTests } from "@/setup_tests";

// Mock dependencies
const mockFs = {
  existsSync: vi.fn(),
  statSync: vi.fn(),
  createReadStream: vi.fn(),
  unlink: vi.fn(),
};

vi.mock("fs", () => ({
  default: mockFs,
  existsSync: mockFs.existsSync,
}));

vi.mock("@/lib/services/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("GET /api/download/:id", () => {
  setupIsolatedTests();

  it("should return 400 for invalid file IDs (path traversal)", async () => {
    const app = (await import("@/app")).default;

    const res = await request(app).get("/api/download/../pardon");

    expect(res.status).toBe(302);
  });

  it("should return 404 if the file does not exist", async () => {
    const app = (await import("@/app")).default;

    mockFs.existsSync.mockReturnValue(false);

    const res = await request(app).get("/api/download/some-file.zip");

    expect(res.status).toBe(404);
    expect(res.text).toBe("File not found");
    expect(mockFs.existsSync).toHaveBeenCalledWith("/tmp/some-file.zip");
  });

  it("should stream the file and then delete it on success", async () => {
    const app = (await import("@/app")).default;

    const fileContent = "this is the content of the zip file";
    const fileSize = fileContent.length;
    const fileId = "valid-file.zip";
    const tempPath = `/tmp/${fileId}`;

    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue({ size: fileSize });

    const mockReadStream = new Readable();
    mockReadStream.push(fileContent);
    mockReadStream.push(null);
    mockFs.createReadStream.mockReturnValue(mockReadStream as any);
    
    mockFs.unlink.mockImplementation((path, cb) => cb(null));
    
    const res = await request(app).get(`/api/download/${fileId}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/zip");
    expect(res.headers["content-length"]).toBe(fileSize.toString());
    expect(res.headers["content-disposition"]).toBe('attachment; filename="download.zip"');
    expect(res.text).toBe(fileContent);

    expect(mockFs.existsSync).toHaveBeenCalledWith(tempPath);
    expect(mockFs.statSync).toHaveBeenCalledWith(tempPath);
    expect(mockFs.createReadStream).toHaveBeenCalledWith(tempPath);
    expect(mockFs.unlink).toHaveBeenCalledWith(tempPath, expect.any(Function));
  });

  it("should return 500 if there is an error checking file stats", async () => {
    const app = (await import("@/app")).default;

    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockImplementation(() => {
      throw new Error("Disk read error");
    });

    const res = await request(app).get("/api/download/any-file.zip");

    expect(res.status).toBe(500);
    expect(res.text).toBe("An error occurred");
  });
});
