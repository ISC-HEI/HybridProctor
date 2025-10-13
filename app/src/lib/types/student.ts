

export type Student = {
  ip: string;
  name: string;
  connected: boolean;
  since: number
  allFilesSent: boolean;
}

export type StudentUpdate = {
  ip: string;
  name?: string;
  connected?: boolean;
  since?: number;
  allFilesSent?: boolean;
}
