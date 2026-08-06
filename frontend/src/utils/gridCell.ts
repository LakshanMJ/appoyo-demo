// The whole roster table is ONE css grid (see RosterGrid.tsx) so that column
// boundaries are guaranteed identical across every row — header, vacant row,
// each participant row, and the add-participant row all place their cells as
// direct children of that single grid instead of nesting their own grids.
// This helper keeps the border logic (which column gets a right divider,
// every cell gets a bottom divider) consistent and in one place.

export const TOTAL_COLUMNS = 8; // 1 participant column + 7 day columns

export function cellBorderClasses(columnIndex: number): string {
  const isLastColumn = columnIndex === TOTAL_COLUMNS - 1;
  return `border-b border-slate-200 ${isLastColumn ? '' : 'border-r'}`;
}
