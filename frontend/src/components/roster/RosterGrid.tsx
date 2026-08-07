import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { getWeekColumns } from '../../utils/week';
import { useRosterStore } from '../../store/rosterStore';
import type { Shift } from '../../types/roster';
import { GridHeader } from './GridHeader';
import { VacantShiftRow } from './VacantShiftRow';
import { ParticipantRow } from './ParticipantRow';
import { AddParticipantRow } from './AddParticipantRow';
import { AddShiftModal } from './AddShiftModal';
import { ShiftCard } from './ShiftCard';
import { AddParticipantModal } from './AddParticipantModal';

interface RosterGridProps {
  weekStart: Date;
}

export function RosterGrid({ weekStart }: RosterGridProps) {
  const days = getWeekColumns(weekStart);

  const { loadCaregivers, caregivers, loadParticipants, participants, loadShifts, shifts, vacantShifts, moveShift, createShift, duplicateShift, createParticipant } =
    useRosterStore();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [modalTarget, setModalTarget] = useState<{ participantId: string | null; isoDate: string } | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const shift = event.active.data.current?.shift as Shift | undefined;
    setActiveShift(shift ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveShift(null);
    const { active, over } = event;
    if (!over) return;

    const dropData = over.data.current as { participantId: string | null; isoDate: string } | undefined;
    if (!dropData) return;

    moveShift(active.id as string, dropData.participantId, dropData.isoDate);
  }

  useEffect(() => {
    loadCaregivers();
    loadParticipants();
    loadShifts(
      days[0].isoDate,
      days[6].isoDate
    );
  }, [weekStart]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-auto rounded-none border border-slate-200 bg-white">
        <div className="grid grid-cols-[220px_repeat(7,minmax(150px,1fr))]">
          <GridHeader days={days} />

          <VacantShiftRow
            days={days}
            shifts={vacantShifts}
            loadCaregivers={(caregiverId) =>
              caregivers.find((c) => c.id === caregiverId)
            }
            onAddShift={(pId, date) =>
              setModalTarget({
                participantId: pId,
                isoDate: date,
              })
            }
            onDuplicateShift={duplicateShift}
            onShiftClick={() => { }}
          />

          {participants.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              days={days}
              shifts={shifts.filter((s) => s.participantId === participant.id)}
              loadCaregivers={(caregiverId) =>
                caregivers.find((c) => c.id === caregiverId)
              }
              onAddShift={(pId, date) =>
                setModalTarget({ participantId: pId, isoDate: date })
              }
              onDuplicateShift={duplicateShift}
              onShiftClick={() => { }}
            />
          ))}

          <AddParticipantRow
            days={days}
            onAddParticipant={() => setShowParticipantModal(true)}
            onAddShift={(isoDate) => setModalTarget({ participantId: null, isoDate })}
          />
        </div>
      </div>

      {/* <DragOverlay>
        {activeShift ? <ShiftCard shift={activeShift} staff={getStaff(activeShift.staffId)} /> : null}
      </DragOverlay> */}

      <DragOverlay>
        {activeShift ? (
          <ShiftCard
            shift={activeShift}
            caregiver={
              activeShift.caregiverId
                ? caregivers.find(
                  (c) => c.id === activeShift.caregiverId
                )
                : undefined
            }
          />
        ) : null}
      </DragOverlay>

      {modalTarget && (
        <AddShiftModal
          participants={participants}
          caregivers={caregivers}
          participantId={modalTarget.participantId}
          isoDate={modalTarget.isoDate}
          onClose={() => setModalTarget(null)}
          onSubmit={createShift}
        />
      )}

      {showParticipantModal && (
        <AddParticipantModal
          onClose={() => setShowParticipantModal(false)}
          onSubmit={createParticipant}
        />
      )}
    </DndContext>
  );
}
