import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    allocatedBudget: number;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

export function AddParticipantModal({
  onClose,
  onSubmit,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await onSubmit({
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      allocatedBudget: Number(allocatedBudget) || 0,
    });
    if (!result?.success) {
      setError('First name and last name cannot be empty.');
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="mb-4 flex justify-between">
          <h2 className="text-lg font-semibold text-[#183554]">
            Add Participant
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full rounded-lg border border-slate-200 p-2 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full rounded-lg border border-slate-200 p-2 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-lg border p-2 border border-slate-200 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          <input
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Address line one"
            className="w-full rounded-lg border border-slate-200 p-2 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          <input
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Address line two"
            className="w-full rounded-lg border border-slate-200 p-2 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          <input
            type="number"
            value={allocatedBudget}
            onChange={(e) => setAllocatedBudget(e.target.value)}
            placeholder="Allocated budget"
            className="w-full rounded-lg border p-2 border border-slate-200 text-[14px] focus:border-teal-400 focus:outline-none"
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-fuchsia-800 px-4 py-2 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}