export type StatusEmoji = '🔴' | '🟡' | '🟢' | '⚪';

export type StatusText = 'Critical' | 'Warning' | 'OK' | 'N/A';

export interface TableRow {
  provider: string;
  model: string;
  usedPercent: number | null;
  remainingPercent: number | null;
  status: StatusEmoji;
  statusText: StatusText;
  resetsIn: string;
}

export interface TableData {
  rows: TableRow[];
}
