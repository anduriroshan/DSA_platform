import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlgorithmsByCategory } from '../utils/algorithmRegistry';
import useSEO from '../hooks/useSEO';

const CATEGORY_INFO: Record<string, { icon: string; title: string; description: string }> = {
  sorting: {
    icon: '🫧',
    title: 'SORTING',
    description: 'Bubble, Quick, Merge and more — watch how data lines up.',
  },
  searching: {
    icon: '🔍',
    title: 'SEARCHING',
    description: 'Find elements fast — linear scan vs. binary divide-and-conquer.',
  },
  'data-structures': {
    icon: '📦',
    title: 'STRUCTURES',
    description: 'Stacks, queues, and linked lists with interactive operations.',
  },
  trees: {
    icon: '🌳',
    title: 'TREES',
    description: 'Binary search trees, insertions, and traversal strategies.',
  },
};

function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const barsRef = useRef<number[]>([]);
  const stateRef = useRef<{ i: number; j: number; phase: 'compare' | 'swap' | 'done'; sorted: number }>({
    i: 0, j: 0, phase: 'compare', sorted: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = 14;
    const shuffle = () => {
      const arr = Array.from({ length: BAR_COUNT }, (_, i) => (i + 1) * (100 / BAR_COUNT));
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    barsRef.current = shuffle();
    stateRef.current = { i: 0, j: 0, phase: 'compare', sorted: 0 };

    const TICK = 80;
    let last = 0;

    const draw = (time: number) => {
      if (time - last < TICK) { frameRef.current = requestAnimationFrame(draw); return; }
      last = time;

      const w = canvas.width;
      const h = canvas.height;
      const bars = barsRef.current;
      const s = stateRef.current;
      const gap = 4;
      const barW = (w - gap * (BAR_COUNT + 1)) / BAR_COUNT;

      ctx.clearRect(0, 0, w, h);

      for (let k = 0; k < bars.length; k++) {
        const barH = (bars[k] / 100) * (h - 20);
        const x = gap + k * (barW + gap);
        const y = h - barH;

        if (k >= bars.length - s.sorted) {
          ctx.fillStyle = '#00e676';
        } else if (s.phase !== 'done' && (k === s.j || k === s.j + 1)) {
          ctx.fillStyle = s.phase === 'swap' ? '#ff6b6b' : '#f5c800';
        } else {
          ctx.fillStyle = '#00d4d4';
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 3);
        ctx.fill();
      }

      if (s.phase === 'done') {
        if (s.sorted >= bars.length) {
          setTimeout(() => {
            barsRef.current = shuffle();
            stateRef.current = { i: 0, j: 0, phase: 'compare', sorted: 0 };
          }, 1200);
        }
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      const n = bars.length - s.sorted;
      if (s.phase === 'compare') {
        if (bars[s.j] > bars[s.j + 1]) {
          s.phase = 'swap';
        } else {
          s.j++;
          if (s.j >= n - 1) {
            s.sorted++;
            if (s.sorted >= bars.length - 1) { s.phase = 'done'; s.sorted = bars.length; }
            else { s.j = 0; }
          }
        }
      } else if (s.phase === 'swap') {
        [bars[s.j], bars[s.j + 1]] = [bars[s.j + 1], bars[s.j]];
        s.phase = 'compare';
        s.j++;
        if (s.j >= n - 1) {
          s.sorted++;
          if (s.sorted >= bars.length - 1) { s.phase = 'done'; s.sorted = bars.length; }
          else { s.j = 0; }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" width={420} height={220} />;
}

export default function HomePage() {
  const categories = getAlgorithmsByCategory();
  const [algoCount] = useState(() => Object.values(getAlgorithmsByCategory()).flat().length);

  useSEO({
    title: 'Learn Algorithms Visually',
    description: 'DSAQuest — step through interactive algorithm visualizations, write real Python code, and master data structures one algorithm at a time.',
    keywords: 'DSA, algorithms, data structures, visualization, sorting, searching, trees, linked list, stack, queue, learn programming',
  });

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero-section">
        <span className="hero-deco d1" aria-hidden="true">◆</span>
        <span className="hero-deco d2" aria-hidden="true">✦</span>
        <span className="hero-deco d3" aria-hidden="true">⬡</span>
        <span className="hero-deco d4" aria-hidden="true">◈</span>

        <div className="hero-content animate-fade-in">
          <div className="hero-eyebrow">▶ INTERACTIVE LEARNING PLATFORM</div>
          <h1 className="hero-title">
            LEARN ALGORITHMS<br />
            <span className="accent">THE FUN WAY</span>
          </h1>
          <p className="hero-subtitle">
            Step through visualizations. Write real code. Level up your DSA — one algorithm at a time.
          </p>

          <div className="hero-demo">
            <HeroAnimation />
            <div className="hero-demo-label">LIVE BUBBLE SORT</div>
          </div>

          <div className="hero-cta">
            <Link to="/visualize/bubble-sort" className="btn btn-primary">
              ▶ START LEARNING
            </Link>
            <a href="#categories" className="btn btn-secondary">
              ◎ BROWSE ALGORITHMS
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">{algoCount}+</div>
              <div className="stat-label">ALGORITHMS</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">04</div>
              <div className="stat-label">CATEGORIES</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">∞</div>
              <div className="stat-label">INPUTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-eyebrow">◇ THREE STEPS TO MASTERY</div>
        <h2 className="section-title">HOW IT WORKS</h2>
        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">01</div>
            <div className="how-icon">◈</div>
            <h3>PICK AN ALGORITHM</h3>
            <p>Choose from sorting, searching, trees, and data structures. Read the theory and pseudocode.</p>
          </div>
          <div className="how-card">
            <div className="how-number">02</div>
            <div className="how-icon">▶</div>
            <h3>WATCH IT RUN</h3>
            <p>Step through the visualization frame-by-frame. See every comparison, swap, and decision in real time.</p>
          </div>
          <div className="how-card">
            <div className="how-number">03</div>
            <div className="how-icon">⌨</div>
            <h3>WRITE YOUR CODE</h3>
            <p>Paste your own Python implementation. Our tracer auto-visualizes it — no SDK needed.</p>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section" id="categories">
        <div className="section-eyebrow">◈ CHOOSE YOUR CATEGORY</div>
        <h2 className="section-title">EXPLORE BY CATEGORY</h2>
        <p className="section-subtitle">Pick a topic and dive into interactive visualizations.</p>
        <div className="categories-grid">
          {Object.entries(categories).map(([category, algos], index) => {
            const info = CATEGORY_INFO[category];
            return (
              <div
                key={category}
                className={`category-card animate-slide-up c-${category}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="category-icon">{info?.icon || '📁'}</span>
                <h3>{info?.title || category.toUpperCase()}</h3>
                <p>{info?.description || ''}</p>
                <div className="category-algos">
                  {algos.map(algo => (
                    <Link key={algo.slug} to={`/visualize/${algo.slug}`} className="algo-tag">
                      {algo.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── USP HIGHLIGHT ── */}
      <section className="usp-section">
        <div className="section-eyebrow">✦ WHAT MAKES US DIFFERENT</div>
        <h2 className="section-title">YOUR CODE, VISUALIZED</h2>
        <p className="section-subtitle">
          Paste any Python sorting function and watch it execute step-by-step.
          Our tracer hooks into your code automatically — no imports, no SDK, no setup.
        </p>
        <div className="usp-grid">
          <div className="usp-card">
            <div className="usp-icon">⚡</div>
            <h3>AUTO-TRACE</h3>
            <p>Your plain Python code is visualized automatically via sys.settrace. No annotations needed.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">◆</div>
            <h3>PSEUDOCODE SYNC</h3>
            <p>The active pseudocode line highlights in sync with every visualization step.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">⏱</div>
            <h3>FRAME CONTROL</h3>
            <p>Play, pause, step forward/back at 0.25x-4x speed. Rewind any step anytime.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">∞</div>
            <h3>ANY INPUT</h3>
            <p>Custom arrays, random generation, or your own data. Visualize on any input you want.</p>
          </div>
        </div>
        <div className="usp-cta">
          <Link to="/visualize/bubble-sort" className="btn btn-primary">
            ▶ TRY IT NOW
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">▶ DSA<span className="brand-mark">QUEST</span></span>
            <p className="footer-tagline">Learn algorithms by seeing, doing, and understanding.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>LEARN</h4>
              <Link to="/visualize/bubble-sort">Sorting</Link>
              <Link to="/visualize/linear-search">Searching</Link>
              <Link to="/visualize/stack">Data Structures</Link>
              <Link to="/visualize/bst-operations">Trees</Link>
            </div>
            <div className="footer-col">
              <h4>ABOUT</h4>
              <span>Built for students preparing for placements and competitive programming.</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>DSAQuest 2026. Built with React, D3, and FastAPI.</span>
        </div>
      </footer>
    </div>
  );
}
