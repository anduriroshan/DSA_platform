import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import './index.css';

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const isVisualizerPage = location.pathname.startsWith('/visualize');

  return (
    <div className="app-layout">
      <Navbar
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        sidebarVisible={sidebarVisible}
      />
      <div className="app-body">
        {isVisualizerPage && <Sidebar visible={sidebarVisible} />}
        <main className={`app-content ${isVisualizerPage && sidebarVisible ? 'with-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
