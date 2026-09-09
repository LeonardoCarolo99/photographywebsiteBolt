import { useState } from 'react';
import type { AlbumImage } from '@/types';
import { Maximize2 } from 'lucide-react';

interface GalleryImageProps {
  image: AlbumImage;
  index: number;
  onClick: () => void;
}

export function GalleryImage({ image, onClick }: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-lg bg-gray-900"
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-900" />
      )}
      <img
        src={image.image_url}
        alt={image.caption ?? ''}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5 transition-all duration-300 group-hover:ring-2 group-hover:ring-gold-400/50" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        {image.caption && (
          <p className="font-body text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {image.caption}
          </p>
        )}
        <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/90 text-black opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}
