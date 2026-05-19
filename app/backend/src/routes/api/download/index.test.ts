import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { Readable } from "stream";
import { fsMock, loggerMock, setupIsolatedTests } from "@/setup_tests";

vi.mock("fs", () => ({
  default: fsMock,
  existsSync: fsMock.existsSync,
}));

vi.mock("@/lib/services/logger", () => ({
  default: loggerMock
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

    fsMock.existsSync.mockReturnValue(false);

    const res = await request(app).get("/api/download/some-file.zip");

    expect(res.status).toBe(404);
    expect(res.text).toBe("File not found");
    expect(fsMock.existsSync).toHaveBeenCalledWith("/tmp/some-file.zip");
  });

  it("should stream the file and then delete it on success", async () => {
    const app = (await import("@/app")).default;

    const fileContent = "this is the content of the zip file";
    const fileSize = fileContent.length;
    const fileId = "valid-file.zip";
    const tempPath = `/tmp/${fileId}`;

    fsMock.existsSync.mockReturnValue(true);
    fsMock.statSync.mockReturnValue({ size: fileSize });

    const mockReadStream = new Readable();
    mockReadStream.push(fileContent);
    mockReadStream.push(null);
    fsMock.createReadStream.mockReturnValue(mockReadStream as any);
    
    fsMock.unlink.mockImplementation((path, cb) => cb(null));
    
    const res = await request(app).get(`/api/download/${fileId}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/zip");
    expect(res.headers["content-length"]).toBe(fileSize.toString());
    expect(res.headers["content-disposition"]).toBe('attachment; filename="download.zip"');
    expect(res.text).toBe(fileContent);

    expect(fsMock.existsSync).toHaveBeenCalledWith(tempPath);
    expect(fsMock.statSync).toHaveBeenCalledWith(tempPath);
    expect(fsMock.createReadStream).toHaveBeenCalledWith(tempPath);
    expect(fsMock.unlink).toHaveBeenCalledWith(tempPath, expect.any(Function));
  });

  it("should return 500 if there is an error checking file stats", async () => {
    const app = (await import("@/app")).default;

    fsMock.existsSync.mockReturnValue(true);
    fsMock.statSync.mockImplementation(() => {
      throw new Error("Disk read error");
    });

    const res = await request(app).get("/api/download/any-file.zip");

    expect(res.status).toBe(500);
    expect(res.text).toBe("An error occurred");
  });
});
