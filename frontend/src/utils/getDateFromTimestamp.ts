export function getDateFromTimestamp(timestamp: string): string {
  return new Date(timestamp).toISOString().split('T')[0];
}