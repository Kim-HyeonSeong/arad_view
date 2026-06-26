export interface CmdResult {
  result: number;
  msg: string;
  data?: unknown;
  id?: string | null;
}

export interface Cmd {
  seq_id?: number;
  category?: number;
  content?: string;
  method: number;
  action?: number;
  fail?: number;
  rollback?: number;
  result?: number;
  msg?: string;
  info?: unknown;
}
