// The screenshot shows each shift card with a colored left border + tinted
// background. The color isn't random per-render — it stays consistent for
// the same staff member across the whole grid. We derive it deterministically
// from staffId so the same person always gets the same color, without the
// backend needing to store a color field.

export const SHIFT_PALETTE = [
  { name: 'red', border: '#EF4444', bg: '#FEF2F2' },
  { name: 'purple', border: '#A855F7', bg: '#FAF5FF' },
  { name: 'green', border: '#22C55E', bg: '#F0FDF4' },
  { name: 'teal', border: '#14B8A6', bg: '#F0FDFA' },
  { name: 'amber', border: '#F59E0B', bg: '#FFFBEB' },
] as const;

export type ShiftColor = (typeof SHIFT_PALETTE)[number];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getShiftColor(staffId: string): ShiftColor {
  const idx = hashString(staffId) % SHIFT_PALETTE.length;
  return SHIFT_PALETTE[idx];
}
