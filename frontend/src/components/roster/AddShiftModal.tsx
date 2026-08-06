import { useState } from 'react';
import { X } from 'lucide-react';
import { STAFF } from '../../data/mockData';
import type { CreateShiftDto, ShiftTag } from '../../types/roster';

interface AddShiftModalProps {
  participantId: string | null;
  isoDate: string;
  onClose: () => void;
  onSubmit: (dto: CreateShiftDto) => void;
}

const TAG_OPTIONS: { value: ShiftTag; label: string }[] = [
  { value: 'assistance', label: 'Assistance' },
  { value: 'transport', label: 'Transport' },
  { value: 'domestic', label: 'Domestic' },
  { value: 'community', label: 'Community Access' },
  { value: 'nursing', label: 'Nursing' },
];

export function AddShiftModal({ participantId, isoDate, onClose, onSubmit }: AddShiftModalProps) {
  const [staffId, setStaffId] = useState(Object.keys(STAFF)[0]);
  const [startTime, setStartTime] = useState('9:00AM');
  const [endTime, setEndTime] = useState('5:00PM');
  const [tag, setTag] = useState<ShiftTag>('assistance');
  const [hasAlert, setHasAlert] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ participantId, staffId, date: isoDate, startTime, endTime, tag, hasAlert });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add Shift</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          {isoDate}
          {participantId ? '' : ' · Vacant shift'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Staff member</span>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
            >
              {Object.values(STAFF).map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Start time</span>
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="9:00AM"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">End time</span>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="5:00PM"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Shift type</span>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as ShiftTag)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
            >
              {TAG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasAlert}
              onChange={(e) => setHasAlert(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
            />
            Flag for review
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-fuchsia-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-900"
            >
              Create shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
