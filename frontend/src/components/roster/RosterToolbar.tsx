import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Copy, Filter, MoreHorizontal, Upload, User } from 'lucide-react';
import { formatWeekRange } from '../../utils/week';

interface RosterToolbarProps {
  staffName: string;
  timezone: string;
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPublish: () => void;
}

export function RosterToolbar({
  staffName,
  timezone,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onPublish,
}: RosterToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-3">
        {/* <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-[13px] font-medium text-white hover:bg-teal-700">
          <User className="h-4 w-4" />
          {staffName} - {timezone}
          <ChevronDown className="h-4 w-4" />
        </button> */}

        <button className="flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-[13px] font-medium text-white whitespace-nowrap hover:bg-teal-700">
          <User className="h-4 w-4 shrink-0" />
          <span>{staffName} - {timezone}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>

        <div className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 py-1">
          <button
            onClick={onPrevWeek}
            aria-label="Previous week"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 text-[13px] font-medium text-slate-700">
            Week
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onNextWeek}
            aria-label="Next week"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          <Calendar className="h-4 w-4 text-slate-400" />
          {formatWeekRange(weekStart)}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button> */}

        <button className="flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{formatWeekRange(weekStart)}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>

      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4 text-slate-400" />
          Filter
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          <Copy className="h-4 w-4 text-slate-400" />
          Copy
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          <Upload className="h-4 w-4 text-slate-400" />
          Export
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <button className="rounded-lg h-9 border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {/* <button
          onClick={onPublish}
          className="rounded-lg h-9 bg-fuchsia-800 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-fuchsia-900"
        >
          Publish Shifts
        </button> */}
        {/* <button
          onClick={onPublish}
          className="h-9 min-w-[120px] rounded-lg bg-fuchsia-800 px-5 text-[13px] font-medium text-white hover:bg-fuchsia-900"
        >
          Publish Shifts
        </button> */}
        <button
          onClick={onPublish}
          className="flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-fuchsia-800 px-5 text-[13px] font-medium text-white hover:bg-fuchsia-900"
        >
          Publish Shifts
        </button>
      </div>
    </div>
  );
}
