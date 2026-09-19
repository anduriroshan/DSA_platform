import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAlgorithmsByCategory } from '../../utils/algorithmRegistry';

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  sorting:              { icon: '◈', label: 'Sorting' },
  searching:            { icon: '◎', label: 'Searching' },
  'data-structures':    { icon: '▣', label: 'Structures' },
  trees:                { icon: '⊿', label: 'Trees' },
  graphs:               { icon: '⌬', label: 'Graphs' },
  'dynamic-programming':{ icon: '▦', label: 'Dynamic Prog.' },
  'arrays-hashing':     { icon: '⧉', label: 'Arrays & Hashing' },
};

const ITEM_ICON: Record<string, string> = {
  sorting:               '↕',
  searching:             '◎',
  trees:                 '⊿',
  'data-structures':     '▣',
  graphs:                '⌬',
  'dynamic-programming': '▦',
  'arrays-hashing':      '⧉',
};

// The sidebar's top-level split — chosen by the user, then "option
// specific" from there (own search + own category list). Data structures
// and algorithms used to live together in one flat list; arrays-hashing
// was NeetCode-150 content mislabeled as just another DSA category.
type SidebarMode = 'neetcode' | 'structures' | 'algorithms';

const MODE_META: Record<SidebarMode, { label: string; icon: string; categories: string[] }> = {
  neetcode:   { label: 'NeetCode 150',    icon: '⧉', categories: ['arrays-hashing'] },
  structures: { label: 'Data Structures', icon: '▣', categories: ['data-structures', 'trees', 'graphs'] },
  algorithms: { label: 'Algorithms',      icon: '◈', categories: ['sorting', 'searching', 'dynamic-programming'] },
};

function categoryToMode(category: string): SidebarMode | null {
  for (const mode of Object.keys(MODE_META) as SidebarMode[]) {
    if (MODE_META[mode].categories.includes(category)) return mode;
  }
  return null;
}

interface SidebarProps {
  visible: boolean;
}

export default function Sidebar({ visible }: SidebarProps) {
  const { slug } = useParams<{ slug: string }>();
  const categories = getAlgorithmsByCategory();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const currentAlgoCategory = useMemo(() => {
    if (!slug) return null;
    for (const [cat, algos] of Object.entries(categories)) {
      if (algos.some(a => a.slug === slug)) return cat;
    }
    return null;
  }, [categories, slug]);

  // Deep-linking to an algorithm should land the sidebar directly on the
  // mode that owns it, not force a picker detour every time.
  const [mode, setMode] = useState<SidebarMode | null>(
    () => (currentAlgoCategory ? categoryToMode(currentAlgoCategory) : null)
  );

  useEffect(() => {
    if (currentAlgoCategory) {
      const detected = categoryToMode(currentAlgoCategory);
      if (detected) setMode(detected);
    }
  }, [currentAlgoCategory]);

  const filtered = useMemo(() => {
    if (!mode) return {};
    const q = query.trim().toLowerCase();
    const out: typeof categories = {};
    for (const cat of MODE_META[mode].categories) {
      const algos = categories[cat] || [];
      const matches = q ? algos.filter(a => a.name.toLowerCase().includes(q) || a.slug.includes(q)) : algos;
      if (matches.length) out[cat] = matches;
    }
    return out;
  }, [categories, query, mode]);

  const searching = query.trim().length > 0;
  const visibleCats = Object.keys(filtered);
  const noResults = mode !== null && visibleCats.length === 0;
  const allCollapsed = visibleCats.length > 0 && visibleCats.every(c => collapsed.has(c));

  function toggleCategory(cat: string) {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  function toggleCollapseAll() {
    setCollapsed(allCollapsed ? new Set() : new Set(visibleCats));
  }

  return (
    <aside className={`sidebar ${visible ? '' : 'collapsed'}`}>
      {!mode ? (
        <div className="sidebar-mode-picker">
          <div className="sidebar-mode-picker-title">◇ Browse</div>
          {(Object.keys(MODE_META) as SidebarMode[]).map((m) => {
            const count = MODE_META[m].categories.reduce((n, c) => n + (categories[c]?.length || 0), 0);
            return (
              <button key={m} className="sidebar-mode-btn" onClick={() => setMode(m)}>
                <span className="sidebar-mode-icon">{MODE_META[m].icon}</span>
                <span className="sidebar-mode-label">{MODE_META[m].label}</span>
                <span className="sidebar-mode-count">{count}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="sidebar-sticky">
            <div className="sidebar-mode-header">
              <button className="sidebar-back-btn" onClick={() => setMode(null)} aria-label="Back to menu">
                ← {MODE_META[mode].label}
              </button>
            </div>
            <div className="sidebar-search">
              <div className="sidebar-search-field">
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
              <button
                className="sidebar-collapse-all"
                onClick={toggleCollapseAll}
                title={allCollapsed ? 'Expand all' : 'Collapse all'}
                aria-label={allCollapsed ? 'Expand all categories' : 'Collapse all categories'}
              >
                {allCollapsed ? '⊞' : '⊟'}
              </button>
            </div>
          </div>

          <div className="sidebar-scroll">
            {noResults && (
              <div className="sidebar-empty">No matches</div>
            )}

            {Object.entries(filtered).map(([category, algos]) => {
              const isCollapsed = !searching && collapsed.has(category);
              return (
                <div key={category} className="sidebar-section">
                  <div className="sidebar-section-title">
                    <button
                      className="sidebar-section-toggle"
                      onClick={() => toggleCategory(category)}
                      aria-label={isCollapsed ? `Expand ${CATEGORY_META[category]?.label || category}` : `Collapse ${CATEGORY_META[category]?.label || category}`}
                    >
                      {isCollapsed ? '▸' : '▾'}
                    </button>
                    <span>{CATEGORY_META[category]?.icon}  {CATEGORY_META[category]?.label || category}</span>
                  </div>
                  {!isCollapsed && algos.map(algo => (
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
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}
