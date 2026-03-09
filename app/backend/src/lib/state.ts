// This file holds shared, low-level application state
// to avoid circular dependencies between services.

export const appState = {
  /**
   * The calculated time offset in milliseconds between the server and the client.
   * A value of -1 indicates that the offset has not yet been calculated.
   */
  timeOffset: -1,
  /**
   * Whether the exam is currently locked for students.
   */
  locked: true,
};
