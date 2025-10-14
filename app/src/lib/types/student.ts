

export type Student = {
  ip: string;
  name: string;
  connected: boolean;
  since: number
  allFilesSent: boolean;
  attempts: number;
}

export type StudentUpdate = {
  ip: string;
  name?: string;
  connected?: boolean;
  since?: number;
  allFilesSent?: boolean;
}
