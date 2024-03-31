declare global {
  interface Window {
    apiContextPath: string;
  }
}

function getAppBasePath(): string {
  if (import.meta.env.MODE === 'development') {
    return '/api';
  } else {
    return window.apiContextPath === '/' ? '' : window.apiContextPath;
  }
}

export async function fetchJSON<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(getAppBasePath() + url, options);

  if (!response.ok) {
    throw new Error('Fetch error');
  }

  try {
    const data = (await response.json()) as T;

    return data;
  } catch {
    return undefined as T;
  }
}

export function getRelativeTimeString(date: Date) {
  const timeMs = date.getTime();
  const deltaSeconds = Math.round((Date.now() - timeMs) / 1000);
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ];
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
  return rtf.format(-Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function formatSize(size: number) {
  for (const unit of ['', 'K', 'M']) {
    if (Math.abs(size) < 1024) {
      return `${size.toFixed(1)} ${unit}B`;
    }

    size /= 1024;
  }

  return `${size.toFixed(1)} GB`;
}
