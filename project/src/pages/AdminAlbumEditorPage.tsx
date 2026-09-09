import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Album, AlbumImage } from '@/types';
import { AdminBar } from '@/components/AdminBar';
import {
  ArrowLeft, Loader2, Upload, Trash2, Save, Star, X, ImageIcon, AlertCircle,
} from 'lucide-react';

interface AdminAlbumEditorPageProps {
  albumId: string;
  onBack: () => void;
}

export function AdminAlbumEditorPage({ albumId, onBack }: AdminAlbumEditorPageProps) {
  const { user } = useAuth();
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete confirm
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [albumRes, imagesRes] = await Promise.all([
      supabase.from('albums').select('*').eq('id', albumId).maybeSingle(),
      supabase.from('images').select('*').eq('album_id', albumId).order('sort_order', { ascending: true }),
    ]);

    if (albumRes.error || imagesRes.error) {
      setError(albumRes.error?.message ?? imagesRes.error?.message ?? 'Unknown error');
    } else {
      setAlbum(albumRes.data);
      setEditTitle(albumRes.data?.title ?? '');
      setEditDescription(albumRes.data?.description ?? '');
      setImages(imagesRes.data ?? []);
    }
    setLoading(false);
  }, [albumId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('albums')
      .update({
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      })
      .eq('id', albumId);

    if (error) {
      setError(error.message);
    } else {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      setAlbum((prev) => prev ? { ...prev, title: editTitle.trim(), description: editDescription.trim() || null } : prev);
    }
    setSaving(false);
  };

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const maxOrder = images.length > 0 ? Math.max(...images.map((i) => i.sort_order)) : 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const fileName = `${albumId}/${Date.now()}-${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('album-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('album-images')
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from('images')
          .insert({
            album_id: albumId,
            image_url: urlData.publicUrl,
            sort_order: maxOrder + i + 1,
          });

        if (insertError) throw insertError;
      }

      await loadData();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
    setUploading(false);
  };

  const handleSetCover = async (imageUrl: string) => {
    const { error } = await supabase
      .from('albums')
      .update({ cover_image_url: imageUrl })
      .eq('id', albumId);

    if (error) {
      setError(error.message);
    } else {
      setAlbum((prev) => prev ? { ...prev, cover_image_url: imageUrl } : prev);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const image = images.find((i) => i.id === imageId);
    if (image) {
      const path = image.image_url.split('/album-images/')[1];
      if (path) {
        await supabase.storage.from('album-images').remove([path]);
      }
    }

    const { error } = await supabase.from('images').delete().eq('id', imageId);
    if (error) {
      setError(error.message);
    } else {
      setImages((prev) => prev.filter((i) => i.id !== imageId));
    }
    setDeleteImageId(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="mt-4 font-body text-gray-400">Album not found.</p>
        <button onClick={onBack} className="mt-4 font-body text-sm text-gold-400 hover:text-gold-300">Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminBar email={user?.email ?? ''} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <button
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 font-body text-sm text-gray-400 transition-colors hover:text-gold-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="font-body text-sm text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="mt-1 font-body text-xs text-red-300 hover:text-red-200">Dismiss</button>
          </div>
        )}

        {/* Album details */}
        <section className="mb-12 rounded-lg border border-white/10 bg-white/[0.02] p-8">
          <h2 className="font-display text-2xl tracking-wide text-white">ALBUM DETAILS</h2>
          <div className="mt-2 h-px w-16 bg-gold-400" />

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white outline-none focus:border-gold-400/50"
              />
            </div>
            <div>
              <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white outline-none focus:border-gold-400/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-md bg-gold-400 px-5 py-2.5 font-body text-sm font-semibold text-black transition-all hover:bg-gold-300 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
              {savedFlash && (
                <span className="font-body text-sm text-green-400">Saved!</span>
              )}
            </div>
          </form>
        </section>

        {/* Photo management */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-wide text-white">PHOTOS</h2>
              <p className="mt-1 font-body text-sm text-gray-500">{images.length} {images.length === 1 ? 'photo' : 'photos'} in this album</p>
            </div>
          </div>

          {/* Upload zone */}
          <label
            className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 transition-colors ${
              uploading
                ? 'border-gold-400/50 bg-gold-400/5'
                : 'border-white/15 hover:border-gold-400/40 hover:bg-white/[0.02]'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
                <p className="mt-3 font-body text-sm text-gray-400">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500" strokeWidth={1.5} />
                <p className="mt-3 font-body text-sm text-gray-400">Click to upload photos, or drag and drop</p>
                <p className="mt-1 font-body text-xs text-gray-600">JPG, PNG, WebP — multiple files supported</p>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </label>

          {uploadError && (
            <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="font-body text-sm text-red-400">{uploadError}</p>
            </div>
          )}

          {/* Photo grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900">
                  <img src={img.image_url} alt={img.caption ?? ''} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Cover badge */}
                  {album.cover_image_url === img.image_url && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 font-body text-xs font-semibold text-black">
                      <Star className="h-3 w-3 fill-black" />
                      Cover
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {album.cover_image_url !== img.image_url && (
                      <button
                        onClick={() => handleSetCover(img.image_url)}
                        title="Set as cover"
                        className="flex flex-1 items-center justify-center gap-1 rounded-md bg-gold-400/90 px-2 py-1.5 font-body text-xs font-semibold text-black transition-colors hover:bg-gold-300"
                      >
                        <Star className="h-3 w-3" />
                        Cover
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteImageId(img.id)}
                      title="Delete photo"
                      className="flex items-center justify-center rounded-md bg-red-500/90 px-2 py-1.5 font-body text-xs text-white transition-colors hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] py-16 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-gray-700" strokeWidth={1} />
              <p className="mt-3 font-body text-sm text-gray-500">No photos yet. Upload some above.</p>
            </div>
          )}
        </section>
      </main>

      {/* Delete image confirm */}
      {deleteImageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6" onClick={() => setDeleteImageId(null)}>
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-gray-950 p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="mx-auto h-10 w-10 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-xl tracking-wide text-white">DELETE PHOTO?</h2>
            <p className="mt-2 font-body text-sm text-gray-400">This will permanently remove the photo from the album.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteImageId(null)}
                className="flex-1 rounded-md border border-white/10 px-4 py-2.5 font-body text-sm text-gray-300 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteImage(deleteImageId)}
                className="flex-1 rounded-md bg-red-500 px-4 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
