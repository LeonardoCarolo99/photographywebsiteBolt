import { useEffect, useState } from 'react';
import { preloadFonts } from '@/lib/fonts';
import { HomePage } from '@/pages/HomePage';
import { AlbumPage } from '@/pages/AlbumPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NavBar } from '@/components/NavBar';
import type { TabName } from '@/components/NavBar';

type Route =
  | { name: 'portfolio' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'album'; id: string };

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('album/')) {
    const id = hash.slice('album/'.length);
    if (id) return { name: 'album', id };
  }
  if (hash === 'about') return { name: 'about' };
  if (hash === 'contact') return { name: 'contact' };
  return { name: 'portfolio' };
}

function routeToTab(route: Route): TabName {
  if (route.name === 'about') return 'about';
  if (route.name === 'contact') return 'contact';
  return 'portfolio';
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    preloadFonts();
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
