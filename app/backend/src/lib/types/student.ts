

export type Student = {
  ip: string;
  name: string;
  connected: boolean;
  hasInternet: boolean;
  since: number;
  sent: boolean;
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
  hasInternet?: boolean;
  since?: number;
  sent?: boolean;
  finished?: boolean;
  hidden?: boolean;
}
