
import { signal } from "@preact/signals";

export const hasInternet = signal<boolean>(false);

/**
 * Checks device connectivity by attempting to reach gstatic.com/generate_204.
 * @param ms Timeout in milliseconds before aborting the request.
 * @returns Whether the external endpoint was reachable.
 */
async function hasExternalInternetAccess(ms: number = 3000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  try {
    await fetch("https://www.gstatic.com/generate_204", {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal
    });

    return true;
  }
  catch (e) {
    return false;
  }
  finally {
    clearTimeout(timeout)
  }
}

/**
 * Sends the current internet connectivity status to the server.
 * @param connected Whether the device has internet access.
 */
async function reportStudent(connected: boolean) {
  fetch("/api/report", {
    method: "POST",
    body: JSON.stringify({
      hasInternet: connected
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

/**
 * Periodically checks connectivity and updates the shared signal, reporting
 * changes to the server.
 * @param ms Interval in milliseconds between connectivity checks.
 * @returns The interval timer that can be used to stop the watcher.
 */
export function startExternalConnectivityWatcher(ms: number = 10000): NodeJS.Timeout {
  const check = async () => {
    const connected =  await hasExternalInternetAccess();

    if (hasInternet.value !== connected) {
      reportStudent(connected)

      hasInternet.value = connected;
    }
  }

  check();
  return setInterval(check, ms);
}
