
import dayjs from "dayjs";
import { beforeEach, vi } from "vitest";

export function setupIsolatedTests() {
  beforeEach(() => {
    delete (globalThis as any).storage;
    delete (globalThis as any).logger;
    delete (globalThis as any).network;
    delete (globalThis as any).sseManager;

    vi.resetModules();
    vi.clearAllMocks();
  });
}

export async function setupStorage() {
  const storage = (await import("@services/storage")).default;
  storage.setOffset(dayjs().toISOString());

  return storage;
}

export const loggerMock = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}

export const storageMock = {
  verifyPassword: vi.fn(),
  setOffset: vi.fn(),
  createSession: vi.fn(),
  verifySession: vi.fn(),
  writeConfig: vi.fn(),
  writeExam: vi.fn(),
  locked: true,
  examConfig: {
    enable: false,
    label: "Default config",
    studentsFiles: []
  },
  writeStudentFiles: vi.fn(),
  writeResources: vi.fn(),
};

export const networkMock = {
  getStudentByName: vi.fn(),
  addUpdate: vi.fn(),
  getStudent: vi.fn(),
};

export const fsMock = {
  createReadStream: vi.fn(),
  promises: {
    stat: vi.fn(),
  },
  existsSync: vi.fn(),
  statSync: vi.fn(),
  unlink: vi.fn(),
}

export const sseManagerMock = {
  addClient: vi.fn(),
  removeClient: vi.fn(),
  send: vi.fn(),
};

export const networkUtilsMock = {
  getIp: vi.fn(),
}
