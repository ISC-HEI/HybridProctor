
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@services/network');
    await import('@services/storage');
    await import('@services/sse');
    await import('@services/logger');
  }
}
