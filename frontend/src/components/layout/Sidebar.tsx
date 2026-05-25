import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAlgorithmsByCategory } from '../../utils/algorithmRegistry';

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  sorting:              { icon: '◈', label: 'Sorting' },
  searching:            { icon: '◎', label: 'Searching' },
  'data-structures':    { icon: '▣', label: 'Structures' },
  trees:                { icon: '⊿', label: 'Trees' },
  graphs:               { icon: '⌬', label: 'Graphs' },
  'dynamic-programming':{ icon: '▦', label: 'Dynamic Prog.' },
};

const ITEM_ICON: Record<string, string> = {
  sorting:               '↕',
  searching:             '◎',
  trees:                 '⊿',
  'data-structures':     '▣',
  graphs:                '⌬',
  'dynamic-programming': '▦',
};

interface SidebarProps {
  visible: boolean;
}

export default function Sidebar({ visible }: SidebarProps) {
  const { slug } = useParams<{ slug: string }>();
  const categories = getAlgorithmsByCategory();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    const out: typeof categories = {};
    for (const [cat, algos] of Object.entries(categories)) {
      const matches = algos.filter(a => a.name.toLowerCase().includes(q) || a.slug.includes(q));
      if (matches.length) out[cat] = matches;
    }
    return out;
  }, [categories, query]);

  const noResults = Object.keys(filtered).length === 0;

  return (
    <aside className={`sidebar ${visible ? '' : 'collapsed'}`}>
      <div className="sidebar-search">
        <input
          className="sidebar-search-input"
          type="text"
          placeholder="◎ SEARCH..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="sidebar-search-clear" onClick={() => setQuery('')} aria-label="Clear search">✕</button>
        )}
      </div>

      {noResults && (
        <div className="sidebar-empty">No matches</div>
      )}

      {Object.entries(filtered).map(([category, algos]) => (
        <div key={category} className="sidebar-section">
          <div className="sidebar-section-title">
            {CATEGORY_META[category]?.icon}  {CATEGORY_META[category]?.label || category}
          </div>
          {algos.map(algo => (
            <Link
              key={algo.slug}
              to={`/visualize/${algo.slug}`}
              className={`sidebar-item ${slug === algo.slug ? 'active' : ''}`}
            >
              <span className="item-icon">{ITEM_ICON[algo.category] || '▸'}</span>
              <span className="item-label">{algo.name}</span>
              <span className={`difficulty-badge ${algo.difficulty}`}>{algo.difficulty.charAt(0).toUpperCase()}</span>
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
