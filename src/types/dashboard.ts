export type StatusEmoji = '🔴' | '🟡' | '🟢' | '⚪';

export type StatusText = 'Critical' | 'Warning' | 'OK' | 'N/A';

export interface DashboardWindow {
  label: string;
  usedPercent: number | null;
  remainingPercent: number | null;
  status: StatusEmoji;
  statusText: StatusText;
  resetsIn: string;
}

export interface DashboardSection {
  title: string;
  windows: DashboardWindow[];
  sections?: DashboardSection[];
}

export interface DashboardProvider {
  name: string;
  sections: DashboardSection[];
}

export interface DashboardData {
  providers: DashboardProvider[];
}
