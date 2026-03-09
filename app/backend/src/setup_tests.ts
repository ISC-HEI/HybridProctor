
import dayjs from "dayjs";
import { beforeEach, vi } from "vitest";

export function setupIsolatedTests() {
  beforeEach(() => {
    delete (globalThis as any).storage;
    delete (globalThis as any).logger;
    delete (globalThis as any).network;
    delete (globalThis as any).sseManager;

    vi.resetModules();
  });
}

export async function setupStorage() {
  const storage = (await import("@services/storage")).default;
  storage.setOffset(dayjs().toISOString());

  return storage;
}
