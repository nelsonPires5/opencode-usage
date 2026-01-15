export const calculateResetAfterSeconds = (
  resetAt: number | null,
  now: number = Date.now()
): number | null => {
  if (!resetAt) {
    return null;
  }

  const diffMs = resetAt - now;
  if (diffMs <= 0) {
    return 0;
  }

  return Math.floor(diffMs / 1000);
};

export const calculateResetAt = (
  resetAfterSeconds: number | null,
  now: number = Date.now()
): number | null => {
  if (resetAfterSeconds === null || resetAfterSeconds === undefined) {
    return null;
  }

  return now + resetAfterSeconds * 1000;
};

export const formatDuration = (seconds: number): string => {
  if (seconds <= 0) {
    return '0s';
  }

  const weeks = Math.floor(seconds / 604800);
  const days = Math.floor((seconds % 604800) / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

export const formatResetAt = (resetAtMs: number): string => {
  return new Date(resetAtMs).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  });
};
