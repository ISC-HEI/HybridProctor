
import { signal } from "@preact/signals";

export const hasInternet = signal<boolean>(false);

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
  catch {
    return false;
  }
  finally {
    clearTimeout(timeout)
  }
}

async function reportStudent(connected: boolean) {
  fetch("/api/report", {
    method: "POST",
    body: JSON.stringify({
      hasInternet: connected
    })
  })
}

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
