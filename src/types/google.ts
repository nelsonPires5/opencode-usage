export interface AntigravityAccount {
  email: string;
  refreshToken: string;
  projectId?: string;
  addedAt: number | string;
  lastUsed?: number;
  rateLimitResetTimes?: Record<string, number>;
  managedProjectId?: string;
}

export interface AntigravityAccountsFile {
  version?: number;
  accounts: AntigravityAccount[];
  activeIndex?: number;
  activeIndexByFamily?: Record<string, number>;
}
