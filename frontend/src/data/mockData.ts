import type { Participant, Shift, Staff } from '../types/roster';

export const STAFF: Record<string, Staff> = {
  ethan: { id: 'ethan', name: 'Ethan Taylor', avatarUrl: 'https://i.pravatar.cc/64?img=13' },
  ava: { id: 'ava', name: 'Ava Williams', avatarUrl: 'https://i.pravatar.cc/64?img=5' },
  noah: { id: 'noah', name: 'Noah Harris', avatarUrl: 'https://i.pravatar.cc/64?img=12' },
  isla: { id: 'isla', name: 'Isla Campbell', avatarUrl: 'https://i.pravatar.cc/64?img=9' },
  jack: { id: 'jack', name: 'Jack Thompson', avatarUrl: 'https://i.pravatar.cc/64?img=14' },
  liam: { id: 'liam', name: 'Liam Anderson', avatarUrl: 'https://i.pravatar.cc/64?img=15' },
  chloeM: { id: 'chloeM', name: 'Chloe Mitchell', avatarUrl: 'https://i.pravatar.cc/64?img=25' },
  lucas: { id: 'lucas', name: 'Lucas White', avatarUrl: 'https://i.pravatar.cc/64?img=18' },
  olivia: { id: 'olivia', name: 'Olivia Parker', avatarUrl: 'https://i.pravatar.cc/64?img=20' },
  marcus: { id: 'marcus', name: 'Marcus Fysh', avatarUrl: 'https://i.pravatar.cc/64?img=33' },
  mia: { id: 'mia', name: 'Mia Robinson', avatarUrl: 'https://i.pravatar.cc/64?img=24' },
};

export const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Arjun Patel', allocatedBudgetCents: 1_600_000, usedBudgetCents: 858_600 },
  { id: 'p2', name: 'Chloe Thompson', allocatedBudgetCents: 3_800_000, usedBudgetCents: 478_700 },
  { id: 'p3', name: 'Danielle Smith', allocatedBudgetCents: 2_500_000, usedBudgetCents: 0 },
];

// Dates align to the reference week: Mon 23 Feb 2026 -> Sun 01 Mar 2026
let shiftIdCounter = 1;
function s(
  participantId: string | null,
  staffId: string,
  date: string,
  startTime: string,
  endTime: string,
  hasAlert = true,
): Shift {
  return {
    id: `shift-${shiftIdCounter++}`,
    participantId,
    staffId,
    date,
    startTime,
    endTime,
    tag: 'assistance',
    hasAlert,
    colorKey: staffId,
  };
}

export const MOCK_SHIFTS: Shift[] = [
  // Arjun Patel
  s('p1', 'ethan', '2026-02-23', '7:00AM', '8:00PM'),
  s('p1', 'ava', '2026-02-23', '8:00AM', '10:00AM'),
  s('p1', 'noah', '2026-02-24', '7:00AM', '8:00AM'),
  s('p1', 'jack', '2026-02-24', '8:00AM', '2:00PM', false),
  s('p1', 'isla', '2026-02-25', '4:00PM', '9:00PM', false),
  s('p1', 'noah', '2026-02-26', '7:00AM', '8:00AM'),
  s('p1', 'liam', '2026-02-26', '1:00PM', '8:00PM', false),
  s('p1', 'chloeM', '2026-02-27', '8:00AM', '10:00AM'),
  s('p1', 'ethan', '2026-02-27', '11:00AM', '3:00PM'),
  s('p1', 'lucas', '2026-02-27', '7:00AM', '8:00PM'),
  s('p1', 'ava', '2026-02-28', '8:00AM', '10:00AM'),

  // Chloe Thompson
  s('p2', 'olivia', '2026-02-23', '8:00PM', '11:00PM'),
  s('p2', 'ava', '2026-02-24', '8:00AM', '8:00PM'),
  s('p2', 'ava', '2026-02-25', '8:00AM', '8:00PM'),
  s('p2', 'chloeM', '2026-02-25', '8:00AM', '2:00PM', false),
  s('p2', 'ava', '2026-02-26', '8:00AM', '8:00PM'),
  s('p2', 'marcus', '2026-02-26', '1:00PM', '8:00PM'),
  s('p2', 'noah', '2026-02-26', '8:00AM', '8:00PM'),
  s('p2', 'mia', '2026-02-28', '8:00AM', '3:00PM', false),
];

export const MOCK_VACANT_SHIFTS: Shift[] = [];
