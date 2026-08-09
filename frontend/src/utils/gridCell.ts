export const TOTAL_COLUMNS = 8;

export function cellBorderClasses(columnIndex: number): string {
  const isLastColumn = columnIndex === TOTAL_COLUMNS - 1;
  return `border-b border-slate-200 ${isLastColumn ? '' : 'border-r'}`;
}
