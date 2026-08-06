import type { CreateShiftDto, MoveShiftDto, RosterWeek, Shift } from '../types/roster';

// Point this at your NestJS server. Move to an env var (VITE_API_URL) before shipping.
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${options?.method ?? 'GET'} ${path} failed: ${res.status}`);
  }
  return res.json();
}

export const rosterApi = {
  // GET /rosters?weekStart=2026-02-23 -> { participants, shifts, vacantShifts }
  getWeek: (weekStartIso: string) => request<RosterWeek>(`/rosters?weekStart=${weekStartIso}`),

  // POST /shifts
  createShift: (dto: CreateShiftDto) =>
    request<Shift>('/shifts', { method: 'POST', body: JSON.stringify(dto) }),

  // PATCH /shifts/:id  (used for both drag-and-drop moves and edits)
  moveShift: (dto: MoveShiftDto) =>
    request<Shift>(`/shifts/${dto.shiftId}`, {
      method: 'PATCH',
      body: JSON.stringify({ participantId: dto.participantId, date: dto.date }),
    }),

  updateShift: (id: string, dto: Partial<CreateShiftDto>) =>
    request<Shift>(`/shifts/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),

  deleteShift: (id: string) => request<void>(`/shifts/${id}`, { method: 'DELETE' }),

  // POST /shifts/:id/duplicate
  duplicateShift: (id: string) => request<Shift>(`/shifts/${id}/duplicate`, { method: 'POST' }),

  publishShifts: (weekStartIso: string) =>
    request<void>('/rosters/publish', { method: 'POST', body: JSON.stringify({ weekStart: weekStartIso }) }),
};
