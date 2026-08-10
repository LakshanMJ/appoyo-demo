import { useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { SideNav } from './components/layout/SideNav';
import { RosterToolbar } from './components/roster/RosterToolbar';
import { RosterGrid } from './components/roster/RosterGrid';
import { getWeekStart, nextWeek, prevWeek } from './utils/week';

export default function App() {
  const [view, setView] = useState<'personal' | 'company'>('company');
  const [activeNav, setActiveNav] = useState('Rostering');
  const [weekStart, setWeekStart] = useState(() =>
    getWeekStart(new Date())
  );

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      <TopBar view={view} onViewChange={setView} />

      <div className="flex min-h-0 flex-1">
        <SideNav active={activeNav} onSelect={setActiveNav} />

        <main className="flex min-w-0 flex-1 flex-col bg-[#F2F6F8]">
          <RosterToolbar
            staffName="Luke Anderson"
            timezone="Australia/Brisbane"
            weekStart={weekStart}
            onPrevWeek={() => setWeekStart((w) => prevWeek(w))}
            onNextWeek={() => setWeekStart((w) => nextWeek(w))}
            onPublish={() => {}}
          />

          <div className="flex min-h-0 flex-1 flex-col px-0 pb-0">
            <RosterGrid weekStart={weekStart} />
          </div>
        </main>
      </div>
    </div>
  );
}
