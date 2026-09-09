import { useAuth } from '@/lib/auth';
import { Camera, LogOut, LayoutGrid, ExternalLink } from 'lucide-react';

interface AdminBarProps {
  email: string;
}

export function AdminBar({ email }: AdminBarProps) {
  const { signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-[0.3em] text-gold-400">APEX LENS</span>
          <span className="ml-2 rounded bg-gold-400/10 px-2 py-0.5 font-body text-xs text-gold-400">ADMIN</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden font-body text-xs text-gray-500 sm:block">{email}</span>
          <a
            href="#/admin"
            className="flex items-center gap-1.5 font-body text-xs text-gray-400 transition-colors hover:text-gold-400"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Dashboard
          </a>
          <a
            href="#/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-body text-xs text-gray-400 transition-colors hover:text-gold-400"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 font-body text-xs text-gray-400 transition-colors hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
