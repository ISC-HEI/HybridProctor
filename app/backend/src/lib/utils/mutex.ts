
interface Options {
  maxLocks?: number;
}

class Mutex {
  private maxLocks: number = 1;
  private locked: number = 0;
  private waitList: ((value: () => void) => void)[] = []

  /**
   * Creates a mutex with an optional maximum number of concurrent locks.
   * @param [options] - Configuration options.
   */
  constructor(options?: Options) {
    if (options) {
      if (options.maxLocks) {
        this.maxLocks = options.maxLocks;
      }
    }
  }

  /**
   * Acquires a lock. If at capacity, the caller is queued until a lock is released.
   * @returns A function that releases the lock when called.
   */
  public lock(): Promise<() => void> {
    return new Promise((resolve, reject) => {
      if (this.locked >= this.maxLocks) {
        this.waitList.push(resolve);
        return;
      }

      this.locked++;
      resolve(this.createUnlock());
    });
  }

  private async unlock() {
    this.locked--;

    if (this.waitList.length !== 0) {
      const nextResolve = this.waitList.shift();
      
      if (nextResolve) {
        this.locked++;
        nextResolve(this.createUnlock());
      }
    }
  }

  /**
   * Returns a one-shot unlock guard. Calling it more than once is a no-op.
   * @returns The unlock function.
   */
  public createUnlock(): () => void {
    let hasUnlocked = false;

    return () => {
      if (!hasUnlocked) {
        this.unlock();
        hasUnlocked = true;
      }
    }
  }

  /**
   * Returns the current number of acquired locks.
   * @returns The lock count.
   */
  public isLocked() {
    return this.locked;
  }
}

export default Mutex;
