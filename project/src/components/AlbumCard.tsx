import type { Album } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  index: number;
  onClick: () => void;
}

export function AlbumCard({ album, index, onClick }: AlbumCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-900 text-left"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <img
        src={album.cover_image_url}
        alt={album.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      {/* Gold border on hover */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-gold-400/60" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-2xl tracking-wide text-white transition-colors group-hover:text-gold-400">
          {album.title.toUpperCase()}
        </h3>
        <div className="mt-2 flex items-center gap-1 font-body text-xs text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
          View Gallery
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
