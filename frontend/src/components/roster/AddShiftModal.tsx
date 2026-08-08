import { useState } from 'react';
import { X } from 'lucide-react';
import type {
  Caregiver,
  CreateShiftDto,
  ShiftType,
} from '../../types/roster';

import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ORG_TZ = 'Australia/Brisbane';

interface AddShiftModalProps {
  participantId: string | null;
  caregivers: Caregiver[];
  participants: { id: string; name: string }[];
  isoDate: string;

  onClose: () => void;

  onSubmit: (
    dto: CreateShiftDto
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

const TYPE_OPTIONS: {
  value: ShiftType;
  label: string;
}[] = [
  {
    value: 'assistance',
    label: 'Assistance',
  },
  {
    value: 'transport',
    label: 'Transport',
  },
  {
    value: 'domestic',
    label: 'Domestic',
  },
  {
    value: 'community',
    label: 'Community Access',
  },
  {
    value: 'nursing',
    label: 'Nursing',
  },
];

export function AddShiftModal({
  participantId,
  isoDate,
  onClose,
  onSubmit,
  caregivers,
  participants,
}: AddShiftModalProps) {
  const [caregiverId, setCaregiverId] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] =
    useState(participantId ?? '');

  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

  const [error, setError] = useState<string | null>(null);

  const [type, setType] =
    useState<ShiftType>('assistance');

  const [hasAlert, setHasAlert] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    if (!startTime || !endTime) {
      setError('Start time and end time are required.');
      return;
    }

    if (
      startTime.isAfter(endTime) ||
      startTime.isSame(endTime)
    ) {
      setError('Start time must be before end time.');
      return;
    }

    if (endTime.diff(startTime, 'minute') < 15) {
      setError('Shift duration must be at least 15 minutes.');
      return;
    }

    /*
     * isoDate is the roster day the user clicked.
     *
     * Example:
     * isoDate = "2026-08-05"
     * startTime = "09:00"
     *
     * This creates:
     * 2026-08-05 09:00 Australia/Brisbane
     *
     * Then toISOString() converts it to UTC for the backend.
     */
    const startDateTime = dayjs.tz(
      `${isoDate} ${startTime.format('HH:mm:ss')}`,
      'YYYY-MM-DD HH:mm:ss',
      ORG_TZ
    );

    const endDateTime = dayjs.tz(
      `${isoDate} ${endTime.format('HH:mm:ss')}`,
      'YYYY-MM-DD HH:mm:ss',
      ORG_TZ
    );

    const finalParticipantId =
      participantId ?? selectedParticipantId;

    console.log('CREATING SHIFT:', {
      rosterDate: isoDate,
      startLocal: startDateTime.format(),
      startUTC: startDateTime.toISOString(),
      endLocal: endDateTime.format(),
      endUTC: endDateTime.toISOString(),
      participantId: finalParticipantId || null,
    });

    const result = await onSubmit({
      participantId: participantId || null,
      caregiverId: caregiverId || null,

      // Keep the roster date too if your DTO supports it.
      date: isoDate,

      // Store UTC in backend.
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),

      type,
      hasAlert,
    });

    if (!result.success) {
      setError(
        result.message ?? 'Failed creating shift'
      );
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Add Shift
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          {isoDate}
          {participantId ? '' : ' · Vacant shift'}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {participantId !== null && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Staff member
              </span>

              <select
                value={caregiverId}
                onChange={(e) =>
                  setCaregiverId(e.target.value)
                }
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
              >
                <option value="">
                  Unassigned
                </option>

                {caregivers.map((caregiver) => (
                  <option
                    key={caregiver.id}
                    value={caregiver.id}
                  >
                    {caregiver.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Start time
              </span>

              <DesktopTimePicker
                value={startTime}
                onChange={(newValue) => {
                  setError(null);
                  setStartTime(newValue);
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                End time
              </span>

              <DesktopTimePicker
                value={endTime}
                onChange={(newValue) => {
                  setError(null);
                  setEndTime(newValue);
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Shift type
            </span>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as ShiftType)
              }
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasAlert}
              onChange={(e) =>
                setHasAlert(e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
            />

            Flag for review
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

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