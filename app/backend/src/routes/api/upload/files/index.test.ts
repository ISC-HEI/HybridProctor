
import { loggerMock, networkMock, setupIsolatedTests, sseManagerMock, storageMock } from "@/setup_tests";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("@/lib/services/storage", () => ({ default: storageMock }))
vi.mock("@/lib/services/logger", () => ({ default: loggerMock }))
vi.mock("@/lib/services/network", () => ({ default: networkMock }))
vi.mock("@/lib/services/sse", () => ({ default: sseManagerMock }))

describe("POST /api/upload/files", () => {
  setupIsolatedTests();

  it("shouldn't write files when locked", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: true, name: "John Doe" });

    const res = await request(app).post("/api/upload/files");

    expect(res.statusCode).toBe(423);
    expect(res.body.message).toBe("The exam hasn't started yet, or has already ended.");
  });

  it ("shouldn't write files when the student has already finished his exam", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: true, name: "John Doe" });
    storageMock.locked = false;

    const res = await request(app).post("/api/upload/files");

    expect(res.statusCode).toBe(423);
    expect(res.body.message).toBe("You already validated your latest version.");
  });

  it ("shouldn't write files when the student isn't registered", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: false, name: "" });
    storageMock.locked = false;

    const res = await request(app).post("/api/upload/files");
    
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Please refresh and enter your name.")
  });

  it("shouldn't write files but work when there aren't any required files.", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: false, name: "John Doe" });
    storageMock.locked = false;

    const res = await request(app).post("/api/upload/files");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exam ended successfully");
  });

  it("should return 400 if the storage module couldn't write the file", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: false, name: "John Doe" });
    storageMock.locked = false;
    storageMock.examConfig.studentsFiles = ["ouais.txt"]
    storageMock.writeStudentFiles.mockResolvedValue("");

    const res = await request(app)
      .post("/api/upload/files")
      .attach("files", Buffer.from("this is a test file."), "test1.txt")
      .attach("files", Buffer.from("this is another test file."), "test2.txt");

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if the users hasn't send any file", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: false, name: "John Doe" });
    storageMock.locked = false;
    storageMock.examConfig.studentsFiles = ["ouais.txt"]
    storageMock.writeStudentFiles.mockResolvedValue("");

    const res = await request(app)
      .post("/api/upload/files")

    expect(res.statusCode).toBe(400);
  })

  it("should write file when there are required files and students send at least one", async () => {
    const app = (await import("@/app")).default;

    networkMock.getStudent.mockResolvedValue({ ip: "127.0.0.1", finished: false, name: "John Doe" });
    storageMock.locked = false;
    storageMock.examConfig.studentsFiles = ["ouais.txt"]
    storageMock.writeStudentFiles.mockResolvedValue("1234")

    const res = await request(app)
      .post("/api/upload/files")
      .attach("files", Buffer.from("this is a test file."), "test1.txt")
      .attach("files", Buffer.from("this is another test file."), "test2.txt");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Files successfully sent. Missing required files: \"ouais.txt\"");
  });
})
