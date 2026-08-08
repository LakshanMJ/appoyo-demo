import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Shift } from '../../types/roster';
import { formatShiftTime } from '../../utils/time';

interface DeleteShiftModalProps {
  shift: Shift;
  onClose: () => void;
  onConfirm: (shiftId: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

export function DeleteShiftModal({
  shift,
  onClose,
  onConfirm,
}: DeleteShiftModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setIsDeleting(true);

    const result = await onConfirm(shift.id);

    if (!result.success) {
      setError(result.message ?? 'Failed to delete shift.');
      setIsDeleting(false);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Delete Shift
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex gap-3 rounded-lg bg-red-50 p-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Are you sure you want to delete this shift?
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {formatShiftTime(shift.startTime)} -{' '}
              {formatShiftTime(shift.endTime)}. This action cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting…' : 'Delete shift'}
          </button>
        </div>
      </div>
    </div>
  );
}