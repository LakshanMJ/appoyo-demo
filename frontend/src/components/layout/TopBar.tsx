import { Bell, ChevronDown, Search } from 'lucide-react';

interface TopBarProps {
  view: 'personal' | 'company';
  onViewChange: (view: 'personal' | 'company') => void;
}

export function TopBar({ view, onViewChange }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between bg-[#183554] px-6 shrink-0">
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-rose-500">A</span>
            <span className="text-orange-400">p</span>
            <span className="text-amber-400">p</span>
            <span className="text-lime-400">o</span>
            <span className="text-teal-400">y</span>
            <span className="text-sky-400">o</span>
          </span>
          <ChevronDown className="h-4 w-4 text-white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </button>
        <div className="h-6 w-px bg-slate-700" />
        <h1 className="text-lg  text-[#DBE0E8]">Rostering</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Search"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        <div className="flex items-center rounded-lg bg-[#132C50] p-1">
          <button
            onClick={() => onViewChange('personal')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'personal' ? 'bg-slate-600/60 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Personal View
          </button>
          <button
            onClick={() => onViewChange('company')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'company' ? 'bg-slate-600/60 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Company View
          </button>
        </div>

        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-rose-400 via-fuchsia-400 to-indigo-400" />
      </div>
    </header>
  );
}
