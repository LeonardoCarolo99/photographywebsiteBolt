import { useEffect, useState } from 'react';
import { preloadFonts } from '@/lib/fonts';
import { AuthProvider, useAuth } from '@/lib/auth';
import { HomePage } from '@/pages/HomePage';
import { AlbumPage } from '@/pages/AlbumPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminAlbumEditorPage } from '@/pages/AdminAlbumEditorPage';
import { NavBar } from '@/components/NavBar';
import type { TabName } from '@/components/NavBar';
import { Loader2 } from 'lucide-react';

type Route =
  | { name: 'portfolio' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'album'; id: string }
  | { name: 'admin-login' }
  | { name: 'admin-dashboard' }
  | { name: 'admin-album'; id: string };

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('album/')) {
    const id = hash.slice('album/'.length);
    if (id) return { name: 'album', id };
  }
  if (hash === 'about') return { name: 'about' };
  if (hash === 'contact') return { name: 'contact' };
  if (hash === 'admin' || hash === 'admin/') return { name: 'admin-dashboard' };
  if (hash.startsWith('admin/album/')) {
    const id = hash.slice('admin/album/'.length);
    if (id) return { name: 'admin-album', id };
  }
  if (hash === 'admin/login') return { name: 'admin-login' };
  return { name: 'portfolio' };
}

function routeToTab(route: Route): TabName {
  if (route.name === 'about') return 'about';
  if (route.name === 'contact') return 'contact';
  return 'portfolio';
}

function AdminRoutes() {
  const { session, loading } = useAuth();
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    );
  }

  if (!session) {
    return <AdminLoginPage />;
  }

  if (route.name === 'admin-album') {
    return (
      <AdminAlbumEditorPage
        albumId={route.id}
        onBack={() => { window.location.hash = '/admin'; }}
      />
    );
  }

  return (
    <AdminDashboardPage
      onEditAlbum={(id) => { window.location.hash = `/admin/album/${id}`; }}
    />
  );
}

function PublicRoutes() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (tab: TabName) => {
    if (tab === 'portfolio') window.location.hash = '/';
    else window.location.hash = `/${tab}`;
  };

  if (route.name === 'album') {
    return (
      <AlbumPage albumId={route.id} onBack={() => { window.location.hash = '/'; }} />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar active={routeToTab(route)} onNavigate={navigate} />
      {route.name === 'portfolio' && (
        <HomePage onOpenAlbum={(id) => { window.location.hash = `/album/${id}`; }} />
      )}
      {route.name === 'about' && <AboutPage />}
      {route.name === 'contact' && <ContactPage />}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    preloadFonts();
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isAdminRoute = route.name === 'admin-login' || route.name === 'admin-dashboard' || route.name === 'admin-album';

  return (
    <AuthProvider>
      {isAdminRoute ? <AdminRoutes /> : <PublicRoutes />}
    </AuthProvider>
  );
}
