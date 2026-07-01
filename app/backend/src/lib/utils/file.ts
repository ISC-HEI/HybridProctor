

/**
 * Formats a byte count into a human-readable string (KB, MB, or GB).
 * @param n - The number of bytes.
 * @returns The formatted size string.
 */
export function formatSize(n: number ) {
  if (n < 10000) return `${(n / 1000).toFixed(2)} KB`;
  if (n < 10000000) return `${(n / 1000000).toFixed(2)} MB`;

  return `${(n / 1000000000).toFixed(2)} GB`;
}
