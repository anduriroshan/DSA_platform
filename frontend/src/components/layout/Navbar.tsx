import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarVisible: boolean;
  showSidebarToggle: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ onToggleSidebar, sidebarVisible, showSidebarToggle, theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="navbar">
      {showSidebarToggle && (
        <button
          className="btn btn-icon btn-secondary"
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          aria-label="Toggle sidebar"
        >
          {sidebarVisible ? '✕' : '☰'}
        </button>
      )}
      <Link to="/" className="navbar-brand">
        <span className="logo-icon">▶</span>
        <span>DSA<span className="brand-mark">QUEST</span></span>
      </Link>

      <div className="navbar-center" />

      <div className="navbar-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀ LIGHT' : '◐ DARK'}
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          ★ GITHUB
        </a>
      </div>
    </nav>
  );
}
