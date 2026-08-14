/**
 * Calendar days for the streak and the activity grid.
 *
 * Keys are local, not UTC: "did I practise today" is a question about the
 * learner's own midnight. Slicing an ISO timestamp would put an evening session
 * east of Greenwich on tomorrow's square.
 */

/** `YYYY-MM-DD` for the local calendar day `date` falls on. */
export function toDayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * The local day `days` away from `date` (negative goes back). Built from date
 * parts rather than by adding milliseconds, so a daylight-saving change cannot
 * skip or repeat a day.
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
