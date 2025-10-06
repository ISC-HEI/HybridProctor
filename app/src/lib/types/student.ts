

export type Student = {
  ip: string;
  name: string;
  connected: boolean;
  allFilesSent: boolean;
}

export type StudentUpdate = {
  ip: string;
  name?: string;
  connected?: boolean;
  allFilesSent?: boolean;
}
