type Params = Record<string, string | number | undefined>;

/**
 * Merges `overrides` into `current`, drops empty/undefined values, and
 * returns a query string (including leading "?", or "" if empty).
 */
export function withParams(current: Params, overrides: Params): string {
  const merged: Record<string, string> = {};

  for (const [key, value] of Object.entries(current)) {
    if (value !== undefined && value !== '') merged[key] = String(value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === '') {
      delete merged[key];
    } else {
      merged[key] = String(value);
    }
  }

  const qs = new URLSearchParams(merged).toString();
  return qs ? `?${qs}` : '';
}
