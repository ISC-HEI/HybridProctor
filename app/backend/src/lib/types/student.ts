

export type Student = {
  ip: string;
  name: string;
  connected: boolean;
  since: number
  finished: boolean;
  attempts: number;
  hidden: boolean;
  latestVersion: {
    hash: string;
    path: string;
  }
}

export type StudentUpdate = {
  ip: string;
  name?: string;
  connected?: boolean;
  since?: number;
  finished?: boolean;
  hidden?: boolean;
}
