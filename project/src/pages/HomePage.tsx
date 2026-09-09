import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Album } from '@/types';
import { AlbumCard } from '@/components/AlbumCard';
import { Loader2 } from 'lucide-react';

interface HomePageProps {
  onOpenAlbum: (id: string) => void;
}

export function HomePage({ onOpenAlbum }: HomePageProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setAlbums(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-900/30 via-black to-black" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.3) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center md:py-36">
          <h1 className="font-display text-6xl leading-none tracking-wide text-white md:text-8xl lg:text-9xl">
            MOTORSPORT
            <span className="block text-gold-400">PHOTOGRAPHY</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-base font-light leading-relaxed text-gray-300 md:text-lg">
            Capturing speed, adrenaline, and the raw emotion of motorsport — from circuit racing to rally stages, two wheels to four.
          </p>
          <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
      </section>

      {/* Albums */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-wide text-white md:text-5xl">COLLECTIONS</h2>
            <p className="mt-2 font-body text-sm text-gray-500">Explore galleries by discipline</p>
          </div>
          <div className="hidden h-px flex-1 ml-8 bg-gradient-to-r from-gold-400/50 to-transparent md:block" />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          </div>
        )}

        {error && (
          <div className="py-32 text-center">
            <p className="font-body text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && albums.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-body text-gray-500">No albums yet.</p>
          </div>
        )}

        {!loading && !error && albums.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, i) => (
              <AlbumCard
                key={album.id}
                album={album}
                index={i}
                onClick={() => onOpenAlbum(album.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12 text-center">
        <p className="font-display text-lg tracking-[0.3em] text-gold-400">APEX LENS</p>
        <p className="mt-2 font-body text-xs text-gray-600">Motorsport Photography Portfolio</p>
      </footer>
    </div>
  );
}
