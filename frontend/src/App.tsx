import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AdSlot from './components/ads/AdSlot';
import './index.css';

type Theme = 'light' | 'dark';
const THEME_KEY = 'dsaq.theme';

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark';
}

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const location = useLocation();
  const isVisualizerPage = location.pathname.startsWith('/visualize');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`app-layout${isVisualizerPage && sidebarVisible ? ' sidebar-open' : ''}`}>
      <Navbar
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        sidebarVisible={sidebarVisible}
        showSidebarToggle={isVisualizerPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="app-body">
        {isVisualizerPage && (
          <>
            <aside className="ad-rail" aria-label="Sponsored">
              <AdSlot size="skyscraper" variant="seamless" />
            </aside>
            <Sidebar visible={sidebarVisible} />
          </>
        )}
        <main className={`app-content${isVisualizerPage ? ' with-rail' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
