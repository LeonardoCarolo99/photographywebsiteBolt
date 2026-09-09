import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Album, AlbumImage } from '@/types';
import { GalleryImage } from '@/components/GalleryImage';
import { NavBar } from '@/components/NavBar';
import type { TabName } from '@/components/NavBar';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

interface AlbumPageProps {
  albumId: string;
  onBack: () => void;
}

export function AlbumPage({ albumId, onBack }: AlbumPageProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const [albumRes, imagesRes] = await Promise.all([
        supabase.from('albums').select('*').eq('id', albumId).maybeSingle(),
        supabase
          .from('images')
          .select('*')
          .eq('album_id', albumId)
          .order('sort_order', { ascending: true }),
      ]);

      if (albumRes.error || imagesRes.error) {
        setError(albumRes.error?.message ?? imagesRes.error?.message ?? 'Unknown error');
      } else {
        setAlbum(albumRes.data);
        setImages(imagesRes.data ?? []);
      }
      setLoading(false);
    })();
  }, [albumId]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, images.length]);

  const navigate = (tab: TabName) => {
    if (tab === 'portfolio') window.location.hash = '/';
    else window.location.hash = `/${tab}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar active="portfolio" onNavigate={navigate} />

      {/* Album header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.3) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
          <button
            onClick={onBack}
            className="group mb-8 flex items-center gap-2 font-body text-sm text-gray-400 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collections
          </button>
          {loading && (
            <div className="flex items-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
              <span className="font-body text-gray-500">Loading album...</span>
            </div>
          )}
          {error && (
            <p className="font-body text-red-400">{error}</p>
          )}
          {album && (
            <>
              <h1 className="font-display text-5xl leading-none tracking-wide text-white md:text-7xl">
                {album.title.toUpperCase()}
              </h1>
              <div className="mt-4 h-px w-20 bg-gold-400" />
              {album.description && (
                <p className="mt-6 max-w-2xl font-body text-base font-light leading-relaxed text-gray-300">
                  {album.description}
                </p>
              )}
              <p className="mt-4 font-body text-sm text-gray-500">
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Gallery */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        {!loading && !error && images.length > 0 && (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {images.map((img, i) => (
              <GalleryImage
                key={img.id}
                image={img}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        )}
        {!loading && !error && album && images.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-body text-gray-500">This album has no photos yet.</p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute right-6 top-6 z-10 text-gray-400 transition-colors hover:text-gold-400"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
          >
            <X className="h-8 w-8" />
          </button>
          <button
            className="absolute left-6 z-10 text-gray-400 transition-colors hover:text-gold-400"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button
            className="absolute right-6 z-10 text-gray-400 transition-colors hover:text-gold-400"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
          >
            <ChevronRight className="h-10 w-10" />
          </button>
          <figure className="max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].caption ?? ''}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            {images[lightboxIndex].caption && (
              <figcaption className="mt-4 text-center font-body text-sm text-gray-400">
                {images[lightboxIndex].caption}
              </figcaption>
            )}
            <p className="mt-2 text-center font-body text-xs text-gray-600">
              {lightboxIndex + 1} / {images.length}
            </p>
          </figure>
        </div>
      )}
    </div>
  );
}
