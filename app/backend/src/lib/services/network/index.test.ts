
import { setupIsolatedTests, setupStorage } from "@/setup_tests";
import { describe, it, expect } from "vitest";

describe("Network service", () => {
  setupIsolatedTests();

  it("should add a student when retrieving one that doesn't exist", async () => {
    setupStorage();

    const network = (await import("@services/network")).default;

    let students = await network.getStudents();

    expect(students.length).toBe(0);

    const student = await network.getStudent("127.0.0.1");

    expect(student.ip).toBe("127.0.0.1");

    students = await network.getStudents();

    expect(students.length).toBe(1);
  });

  it("should add an update", async () => {
    setupStorage();

    const network = (await import("@services/network")).default;

    let student = await network.getStudent("127.0.0.1");

    expect(student.name).toBe("");

    network.addUpdate({ ip: "127.0.0.1", name: "John Doe" });

    student = await network.getStudent("127.0.0.1");

    expect(student.name).toBe("John Doe");
  });
})
