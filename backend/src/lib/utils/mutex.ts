
interface Options {
  maxLocks?: number;
}

class Mutex {
  private maxLocks: number = 1;
  private locked: number = 0;
  private waitList: ((value: () => void) => void)[] = []

  constructor(options?: Options) {
    if (options) {
      if (options.maxLocks) {
        this.maxLocks = options.maxLocks;
      }
    }
  }

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

  public createUnlock(): () => void {
    let hasUnlocked = false;

    return () => {
      if (!hasUnlocked) {
        this.unlock();
        hasUnlocked = true;
      }
    }
  }

  public isLocked() {
    return this.locked;
  }
}

export default Mutex;
