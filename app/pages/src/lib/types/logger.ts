
export type LogType = "all"|"errors"|"warnings"|"infos"|"debug";

export type LogRecord = {
  uuid: string;
  type: LogType;
  timestamp: string;
  issuer?: string;
  action?: string;
  message: string;
}
