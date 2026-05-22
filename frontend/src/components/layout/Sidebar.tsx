import { Link, useParams } from 'react-router-dom';
import { getAlgorithmsByCategory } from '../../utils/algorithmRegistry';

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  sorting: { icon: '📊', label: 'Sorting' },
  searching: { icon: '🔍', label: 'Searching' },
  'data-structures': { icon: '📦', label: 'Data Structures' },
  trees: { icon: '🌳', label: 'Trees' },
};

interface SidebarProps {
  visible: boolean;
}

export default function Sidebar({ visible }: SidebarProps) {
  const { slug } = useParams<{ slug: string }>();
  const categories = getAlgorithmsByCategory();

  return (
    <aside className={`sidebar ${visible ? '' : 'collapsed'}`}>
      {Object.entries(categories).map(([category, algos]) => (
        <div key={category} className="sidebar-section">
          <div className="sidebar-section-title">
            {CATEGORY_META[category]?.icon} {CATEGORY_META[category]?.label || category}
          </div>
          {algos.map(algo => (
            <Link
              key={algo.slug}
              to={`/visualize/${algo.slug}`}
              className={`sidebar-item ${slug === algo.slug ? 'active' : ''}`}
            >
              <span className="item-icon">
                {algo.category === 'sorting' ? '↕' :
                 algo.category === 'searching' ? '◎' :
                 algo.category === 'trees' ? '⊿' : '▣'}
              </span>
              <span>{algo.name}</span>
              <span className={`difficulty-badge ${algo.difficulty}`}>
                {algo.difficulty}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
