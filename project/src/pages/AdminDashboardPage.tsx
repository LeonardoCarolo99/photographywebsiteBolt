import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Album } from '@/types';
import { AdminBar } from '@/components/AdminBar';
import { Plus, Trash2, Pencil, Loader2, ImageIcon, X } from 'lucide-react';

interface AdminDashboardPageProps {
  onEditAlbum: (id: string) => void;
}

export function AdminDashboardPage({ onEditAlbum }: AdminDashboardPageProps) {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadAlbums = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);

    const maxOrder = albums.length > 0 ? Math.max(...albums.map((a) => a.sort_order)) : 0;

    const { data, error } = await supabase
      .from('albums')
      .insert({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        sort_order: maxOrder + 1,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setCreating(false);
    } else {
      setShowCreate(false);
      setNewTitle('');
      setNewDescription('');
      setCreating(false);
      onEditAlbum(data.id);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('albums').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminBar email={user?.email ?? ''} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-wide text-white md:text-5xl">MANAGE COLLECTIONS</h1>
            <p className="mt-2 font-body text-sm text-gray-500">Create, edit, and organize your photo albums</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-md bg-gold-400 px-5 py-2.5 font-body text-sm font-semibold text-black transition-all hover:bg-gold-300"
          >
            <Plus className="h-4 w-4" />
            New Album
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="font-body text-sm text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="mt-1 font-body text-xs text-red-300 hover:text-red-200">Dismiss</button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          </div>
        )}

        {!loading && albums.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] py-24 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-700" strokeWidth={1} />
            <p className="mt-4 font-body text-gray-500">No collections yet. Create your first album to get started.</p>
          </div>
        )}

        {!loading && albums.length > 0 && (
          <div className="space-y-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-gold-400/30"
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-gray-900">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl tracking-wide text-white">{album.title}</h3>
                  {album.description && (
                    <p className="mt-1 truncate font-body text-sm text-gray-500">{album.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditAlbum(album.id)}
                    className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 font-body text-xs text-gray-300 transition-colors hover:border-gold-400/50 hover:text-gold-400"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(album.id)}
                    className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 font-body text-xs text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-gray-950 p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide text-white">NEW ALBUM</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none focus:border-gold-400/50"
                  placeholder="e.g. Le Mans 2026"
                />
              </div>
              <div>
                <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">Description (optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none focus:border-gold-400/50"
                  placeholder="A short description of this collection..."
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-400 px-6 py-3 font-body text-sm font-semibold text-black transition-all hover:bg-gold-300 disabled:opacity-50"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create & Edit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-gray-950 p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="mx-auto h-10 w-10 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-xl tracking-wide text-white">DELETE ALBUM?</h2>
            <p className="mt-2 font-body text-sm text-gray-400">This will permanently delete the album and all its photos. This cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-md border border-white/10 px-4 py-2.5 font-body text-sm text-gray-300 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
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
