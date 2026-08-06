import { ChevronRight } from 'lucide-react';

interface NavItem {
  label: string;
  expandable?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home' },
  { label: 'Core HR', expandable: true },
  { label: 'Rostering' },
  { label: 'CRM', expandable: true },
  { label: 'Incidents', expandable: true },
  { label: 'Home Management' },
  { label: 'Payroll', expandable: true },
  { label: 'Time Tracking', expandable: true },
  { label: 'Compliance', expandable: true },
  { label: 'Advanced HR', expandable: true },
  { label: 'Reports' },
  { label: 'Company Settings' },
];

interface SideNavProps {
  active: string;
  onSelect: (label: string) => void;
}

export function SideNav({ active, onSelect }: SideNavProps) {
  return (
    <nav className="flex w-60 shrink-0 flex-col gap-0.5 bg-[#0B2545] px-0 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.label === active;
        return (
          <button
            key={item.label}
            onClick={() => onSelect(item.label)}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
              isActive
                ? 'bg-[#1A3A66] font-medium text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{item.label}</span>
            {item.expandable && <ChevronRight className="h-4 w-4 text-slate-500" />}
          </button>
        );
      })}
    </nav>
  );
}
