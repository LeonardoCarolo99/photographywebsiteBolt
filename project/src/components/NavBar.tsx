import { Camera } from 'lucide-react';

export type TabName = 'portfolio' | 'about' | 'contact';

interface NavBarProps {
  active: TabName;
  onNavigate: (tab: TabName) => void;
}

const TABS: { label: string; value: TabName }[] = [
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'About', value: 'about' },
  { label: 'Contact', value: 'contact' },
];

export function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate('portfolio')}
          className="flex items-center gap-3"
        >
          <Camera className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-[0.3em] text-gold-400">APEX LENS</span>
        </button>

        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onNavigate(tab.value)}
              className={`relative px-4 py-2 font-body text-sm font-medium transition-colors ${
                active === tab.value
                  ? 'text-gold-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {active === tab.value && (
                <span className="absolute inset-x-3 -bottom-px h-px bg-gold-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
