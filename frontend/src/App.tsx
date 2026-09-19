import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AdSlot from './components/ads/AdSlot';
import { useVisualizerStore } from './store/useVisualizerStore';
import './index.css';

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // Theme lives in the Zustand store (not local state) so any component —
  // decorative day/night motifs included — can read it without prop drilling.
  const theme = useVisualizerStore((s) => s.theme);
  const toggleTheme = useVisualizerStore((s) => s.toggleTheme);
  const location = useLocation();
  const isVisualizerPage = location.pathname.startsWith('/visualize');

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
