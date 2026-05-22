import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarVisible: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarVisible }: NavbarProps) {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn btn-icon btn-secondary"
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarVisible ? '✕' : '☰'}
        </button>
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">⚡</div>
          <span>DSA Visualizer</span>
        </Link>
      </div>

      <div className="navbar-center">
        {/* Can add search or breadcrumbs later */}
      </div>

      <div className="navbar-actions">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          ⭐ GitHub
        </a>
      </div>
    </nav>
  );
}
