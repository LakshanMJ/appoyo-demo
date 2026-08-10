import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type {
  Caregiver,
  CreateShiftDto,
  Shift,
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
  // participants: { id: string; name: string }[];
  isoDate: string;

  editingShift?: Shift | null;

  onClose: () => void;

  onSubmit: (
    dto: CreateShiftDto
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;

  onUpdate?: (
    shiftId: string,
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
    { value: 'assistance', label: 'Assistance' },
    { value: 'transport', label: 'Transport' },
    { value: 'domestic', label: 'Domestic' },
    { value: 'community', label: 'Community Access' },
    { value: 'nursing', label: 'Nursing' },
  ];

export function AddShiftModal({
  participantId,
  isoDate,
  editingShift,
  onClose,
  onSubmit,
  onUpdate,
  caregivers,
}: AddShiftModalProps) {
  const isEditMode = Boolean(editingShift);

  const [caregiverId, setCaregiverId] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] =
    useState(participantId ?? '');

  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<ShiftType>('assistance');

  const [hasAlert, setHasAlert] = useState(true);

  const [shiftDate, setShiftDate] = useState(isoDate);

  useEffect(() => {
    if (!editingShift) return;

    const startLocal = dayjs(editingShift.startTime).tz(ORG_TZ);
    const endLocal = dayjs(editingShift.endTime).tz(ORG_TZ);

    setCaregiverId(editingShift.caregiverId ?? '');
    setSelectedParticipantId(editingShift.participantId ?? '');
    setStartTime(startLocal);
    setEndTime(endLocal);
    setType(editingShift.type as ShiftType);
    setHasAlert(Boolean(editingShift.hasAlert));
    setShiftDate(startLocal.format('YYYY-MM-DD'));
  }, [editingShift]);

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

    const startDateTime = dayjs.tz(
      `${shiftDate} ${startTime.format('HH:mm:ss')}`,
      'YYYY-MM-DD HH:mm:ss',
      ORG_TZ
    );

    const endDateTime = dayjs.tz(
      `${shiftDate} ${endTime.format('HH:mm:ss')}`,
      'YYYY-MM-DD HH:mm:ss',
      ORG_TZ
    );

    const finalParticipantId =
      participantId ?? selectedParticipantId;

    const dto: CreateShiftDto = {
      participantId: finalParticipantId || null,
      caregiverId: caregiverId || null,

      date: shiftDate,

      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),

      type,
      hasAlert,
    };

    console.log(isEditMode ? 'UPDATING SHIFT:' : 'CREATING SHIFT:', {
      rosterDate: shiftDate,
      startLocal: startDateTime.format(),
      startUTC: startDateTime.toISOString(),
      endLocal: endDateTime.format(),
      endUTC: endDateTime.toISOString(),
      participantId: finalParticipantId || null,
    });

    const result =
      isEditMode && editingShift
        ? await onUpdate?.(editingShift.id, dto)
        : await onSubmit(dto);

    if (!result?.success) {
      setError(
        result?.message ??
        (isEditMode ? 'Failed updating shift' : 'Failed creating shift')
      );
      return;
    }

    onClose();
  }

  const timePickerSx = {
    '& .MuiPickersOutlinedInput-root': {
      borderRadius: '10px',
      fontFamily: 'Inter, sans-serif',

      '& .MuiPickersOutlinedInput-notchedOutline': {
        borderColor: '#e2e8f0',
        borderRadius: '8px',
      },

      '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
        borderColor: '#2dd4bf !important',
        borderWidth: '1px !important',
      },
    },

    '& .MuiPickersSectionList-sectionContent': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      color: '#334155',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#183554]">
            {isEditMode ? 'Edit Shift' : 'Add Shift'}
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
          {shiftDate}
          {participantId ? '' : ' · Vacant shift'}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {participantId !== null && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[#183554]">
                Staff member
              </span>

              <select
                value={caregiverId}
                onChange={(e) =>
                  setCaregiverId(e.target.value)
                }
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#334155] focus:border-teal-400 focus:outline-none"
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
              <span className="text-sm font-medium text-[#183554]">
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
                    sx: timePickerSx,
                  },
                  desktopPaper: {
                    sx: {
                      fontFamily: 'Inter, sans-serif',

                      '& .MuiMultiSectionDigitalClock-root': {
                        fontFamily: 'Inter, sans-serif',
                      },

                      '& .MuiMultiSectionDigitalClockSection-root': {
                        fontFamily: 'Inter, sans-serif',
                      },

                      '& .MuiMultiSectionDigitalClockSection-item': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#334155',
                        borderRadius: '6px',

                        '&:hover': {
                          backgroundColor: '#f0fdfa',
                        },

                        '&.Mui-selected': {
                          backgroundColor: '#ccfbf1',
                          color: '#0f766e',
                          fontWeight: 600,
                        },
                      },

                      '& .MuiDialogActions-root': {
                        padding: '8px 16px 12px',
                      },

                      '& .MuiDialogActions-root .MuiButton-root': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        color: '#0f766e',
                        borderRadius: '6px',

                        '&:hover': {
                          backgroundColor: '#f0fdfa',
                        },
                      },
                    },
                  },
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[#183554]">
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
                    sx: timePickerSx,
                  },
                  desktopPaper: {
                    sx: {
                      fontFamily: 'Inter, sans-serif',

                      '& .MuiMultiSectionDigitalClock-root': {
                        fontFamily: 'Inter, sans-serif',
                      },

                      '& .MuiMultiSectionDigitalClockSection-root': {
                        fontFamily: 'Inter, sans-serif',
                      },

                      '& .MuiMultiSectionDigitalClockSection-item': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#334155',
                        borderRadius: '6px',

                        '&:hover': {
                          backgroundColor: '#f0fdfa',
                        },

                        '&.Mui-selected': {
                          backgroundColor: '#ccfbf1',
                          color: '#0f766e',
                          fontWeight: 600,
                        },
                      },

                      '& .MuiDialogActions-root': {
                        padding: '8px 16px 12px',
                      },

                      '& .MuiDialogActions-root .MuiButton-root': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        color: '#0f766e',
                        borderRadius: '6px',

                        '&:hover': {
                          backgroundColor: '#f0fdfa',
                        },
                      },
                    },
                  },
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#183554]">
              Shift type
            </span>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as ShiftType)
              }
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#334155] focus:border-teal-400 focus:outline-none"
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
              {isEditMode ? 'Save changes' : 'Create shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}