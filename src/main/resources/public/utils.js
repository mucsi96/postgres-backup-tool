export async function fetchJSON(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("Fetch error");
  }

  const data = await response.json();

  return data;
}

export function getRelativeTimeString(date) {
  const timeMs = date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units = ["second", "minute", "hour", "day", "week", "month", "year"];
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function formatSize(size) {
  for(const unit of ["", "K", "M"]) {
    if (Math.abs(size) < 1024) {
      return `${size.toFixed(1)} ${unit}B`;
    }

    size /= 1024;
  }

  return `${size.toFixed(1)} GB`;
}
