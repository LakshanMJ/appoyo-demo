import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    address: string;
    allocatedBudget: number;
  }) => void;
}

export function AddParticipantModal({
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name,
      phone,
      address,
      allocatedBudget: Number(allocatedBudget) || 0,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <div className="mb-4 flex justify-between">
          <h2 className="text-lg font-semibold">
            Add Participant
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Participant name"
            className="w-full rounded-lg border p-2 border border-slate-200 focus:border-teal-400 focus:outline-none"
          />


          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-lg border p-2 border border-slate-200 focus:border-teal-400 focus:outline-none"
          />


          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full rounded-lg border p-2 border border-slate-200 focus:border-teal-400 focus:outline-none"
          />


          <input
            type="number"
            value={allocatedBudget}
            onChange={(e) => setAllocatedBudget(e.target.value)}
            placeholder="Allocated budget"
            className="w-full rounded-lg border p-2 border border-slate-200 focus:border-teal-400 focus:outline-none"
          />


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