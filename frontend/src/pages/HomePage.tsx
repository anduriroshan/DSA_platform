import { Link } from 'react-router-dom';
import { getAlgorithmsByCategory } from '../utils/algorithmRegistry';

const CATEGORY_INFO: Record<string, { icon: string; title: string; description: string }> = {
  sorting: {
    icon: '📊',
    title: 'Sorting Algorithms',
    description: 'Visualize how different sorting algorithms organize data, from simple Bubble Sort to efficient Quick Sort.',
  },
  searching: {
    icon: '🔍',
    title: 'Searching Algorithms',
    description: 'Understand how search algorithms find elements in arrays, from linear scanning to binary divide-and-conquer.',
  },
  'data-structures': {
    icon: '📦',
    title: 'Data Structures',
    description: 'Explore fundamental data structures like Stacks, Queues, and Linked Lists with interactive operations.',
  },
  trees: {
    icon: '🌳',
    title: 'Trees',
    description: 'Visualize Binary Search Trees, insertion, deletion, and different tree traversal strategies.',
  },
};

export default function HomePage() {
  const categories = getAlgorithmsByCategory();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">
            Master DSA with{' '}
            <span className="gradient-text">Interactive Visualizations</span>
          </h1>
          <p className="hero-subtitle">
            See algorithms come to life. Step through each operation, watch data transform
            in real-time, and write your own code — all in one powerful platform.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/visualize/bubble-sort" className="btn btn-primary">
              ▶ Start Visualizing
            </Link>
            <a href="#categories" className="btn btn-secondary">
              Explore Algorithms
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">12+</div>
              <div className="stat-label">Algorithms</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">4</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">∞</div>
              <div className="stat-label">Custom Inputs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" id="categories">
        <h2 className="section-title">Explore by Category</h2>
        <p className="section-subtitle">Choose a topic and dive deep into interactive algorithm visualizations</p>
        <div className="categories-grid">
          {Object.entries(categories).map(([category, algos], index) => {
            const info = CATEGORY_INFO[category];
            return (
              <div
                key={category}
                className="category-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`category-icon ${category}`}>
                  {info?.icon || '📁'}
                </div>
                <h3>{info?.title || category}</h3>
                <p>{info?.description || ''}</p>
                <div className="category-algos">
                  {algos.map(algo => (
                    <Link
                      key={algo.slug}
                      to={`/visualize/${algo.slug}`}
                      className="algo-tag"
                    >
                      {algo.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
