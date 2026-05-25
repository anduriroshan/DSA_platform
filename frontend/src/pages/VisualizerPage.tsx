import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { algorithmRegistry, getAlgorithmNavigation } from '../utils/algorithmRegistry';
import useSEO from '../hooks/useSEO';
import LearnTab from '../components/tabs/LearnTab';
import VizPanel from '../components/visualization/VizPanel';
import CodeEditorDrawer from '../components/editor/CodeEditorDrawer';

const CATEGORY_LABELS: Record<string, string> = {
  sorting: 'Sorting',
  searching: 'Searching',
  'data-structures': 'Structures',
  trees: 'Trees',
};

export default function VisualizerPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    loadAlgorithm,
    currentAlgorithm,
    frames,
    codeEditorOpen,
    toggleCodeEditor,
  } = useVisualizerStore();

  const config = slug ? algorithmRegistry[slug] : null;
  const nav = slug ? getAlgorithmNavigation(slug) : null;

  useSEO({
    title: config ? `${config.name} — Interactive Visualization` : 'Algorithm Not Found',
    description: config
      ? `Learn ${config.name} with step-by-step visualization. ${config.description} Time: ${config.timeComplexity}, Space: ${config.spaceComplexity}.`
      : 'Algorithm visualization not found.',
    keywords: config
      ? `${config.name}, ${config.category}, algorithm visualization, DSA, data structures, ${config.difficulty}`
      : undefined,
  });

  useEffect(() => {
    if (slug && slug !== currentAlgorithm) loadAlgorithm(slug);
  }, [slug]);

  useEffect(() => {
    if (slug && frames.length === 0) loadAlgorithm(slug);
  }, []);

  if (!config) {
    return (
      <div className="empty-state">
        <div className="icon">◇</div>
        <p>ALGORITHM NOT FOUND<br />Select one from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="visualizer-page">
      <div className="algo-bar">
        <div className="algo-breadcrumb">
          <span className="breadcrumb-category">{CATEGORY_LABELS[config.category] || config.category}</span>
          <span className="breadcrumb-sep">▸</span>
          <span className="breadcrumb-name">{config.name}</span>
          {nav && <span className="breadcrumb-pos">({nav.categoryPosition}/{nav.categoryTotal})</span>}
        </div>

        <span className="complexity-badge">⏱ {config.timeComplexity}</span>
        <span className="complexity-badge space">💾 {config.spaceComplexity}</span>
        <span className={`difficulty-badge ${config.difficulty}`}>{config.difficulty}</span>

        <div className="algo-nav">
          {nav?.prev ? (
            <Link to={`/visualize/${nav.prev.slug}`} className="algo-nav-btn" title={nav.prev.name}>◀ PREV</Link>
          ) : (
            <span className="algo-nav-btn disabled">◀ PREV</span>
          )}
          {nav?.next ? (
            <Link to={`/visualize/${nav.next.slug}`} className="algo-nav-btn" title={nav.next.name}>NEXT ▶</Link>
          ) : (
            <span className="algo-nav-btn disabled">NEXT ▶</span>
          )}
        </div>
      </div>

      <div className="viz-workspace">
        <div className="content-column">
          <div className="tab-content">
            <LearnTab />
          </div>

          {!codeEditorOpen && (
            <button
              className="code-fab"
              onClick={toggleCodeEditor}
              title="Open code editor"
              aria-label="Open code editor"
            >
              <span className="code-fab-icon">⌨</span>
              <span className="code-fab-label">CODE</span>
            </button>
          )}

          <CodeEditorDrawer />
        </div>

        <VizPanel />
      </div>
    </div>
  );
}
