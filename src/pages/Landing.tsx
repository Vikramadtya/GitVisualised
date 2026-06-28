import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, BookOpen, GitMerge, Zap, Shield } from 'lucide-react';
import styles from './Landing.module.css';
import GitGraph from '../components/graph/GitGraph';
import type { GraphState } from '../store/useScenarioStore';

const initialHeroGraph: GraphState = {
  commits: [
    { id: 'c1', parents: [], message: 'Initial commit' },
    { id: 'c2', parents: ['c1'], message: 'Add core engine' },
    { id: 'c3', parents: ['c2'], message: 'Setup routing' }
  ],
  branches: [
    { name: 'main', target: 'c3' }
  ],
  HEAD: 'main',
  stagingArea: [],
  workingDirectory: []
};

const Landing: React.FC = () => {
  const [heroStep, setHeroStep] = useState(0);

  const heroGraph = React.useMemo(() => {
    const commits = [...initialHeroGraph.commits];
    for (let i = 0; i < heroStep; i++) {
      const newCommitId = `c${commits.length + 1}`;
      commits.push({ id: newCommitId, parents: [commits[commits.length - 1].id], message: `Feature ${newCommitId}` });
    }
    return {
      ...initialHeroGraph,
      commits,
      branches: [{ name: 'main', target: commits[commits.length - 1].id }]
    };
  }, [heroStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroStep(prev => (prev >= 3 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.landingContainer}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Master Git with <br/>
            <span className="text-gradient">Visualized Practice</span>
          </h1>
          <p className={styles.subtitle}>
            A complete, interactive course based on the legendary <em>Pro Git</em> book. 
            Type real commands, see the commit graph animate instantly, and master 90% of developer workflows.
          </p>
          <div className={styles.ctaGroup}>
            <Link to="/playground" className={`${styles.btn} ${styles.btnPrimary}`}>
              <Terminal size={20} />
              Start Interactive Sandbox
            </Link>
            <Link to="/learn" className={`${styles.btn} ${styles.btnSecondary}`}>
              <BookOpen size={20} />
              View Curriculum
            </Link>
          </div>
        </div>

        <div className={styles.heroGraphWrapper}>
          <div className={`${styles.heroGraph} glass-panel`}>
            <div style={{ position: 'absolute', top: 12, left: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-secondary)', zIndex: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent-success)', animation: 'pulse 2s infinite' }} />
              Live Git Graph
            </div>
            <GitGraph customGraph={heroGraph} />
          </div>
        </div>

        {/* Decorative background elements */}
        <div className={styles.glowOrb1}></div>
        <div className={styles.glowOrb2}></div>
      </header>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <h4 className={styles.statNumber}>15+</h4>
          <p className={styles.statLabel}>Interactive Scenarios</p>
        </div>
        <div className={styles.statItem}>
          <h4 className={styles.statNumber}>40+</h4>
          <p className={styles.statLabel}>Core Concepts</p>
        </div>
        <div className={styles.statItem}>
          <h4 className={styles.statNumber}>100%</h4>
          <p className={styles.statLabel}>Free & Open Source</p>
        </div>
      </div>

      <section className={styles.features}>
        <div className={`${styles.featureCard} ${styles.span2} glass-panel`}>
          <div className={styles.featureIcon}><GitMerge size={32} /></div>
          <h3>Live Graph Animations</h3>
          <p>See exactly how branching, merging, and rebasing work with beautiful Framer Motion powered animations. No more mental gymnastics to visualize the DAG.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><Terminal size={32} /></div>
          <h3>Guided On-Rails Sandbox</h3>
          <p>Follow structured scenarios that simulate real-world developer problems.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><BookOpen size={32} /></div>
          <h3>Pro Git Reference</h3>
          <p>An exhaustive encyclopedia of commands based on the authoritative Git documentation.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><Zap size={32} /></div>
          <h3>Instant Feedback</h3>
          <p>Get immediate validation or helpful hints when you type a command.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><Shield size={32} /></div>
          <h3>Safe Environment</h3>
          <p>Make all the mistakes you want without risking your real repositories.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Git Visualised. Built for developers.</p>
        <div className={styles.footerLinks}>
          <Link to="/learn">Curriculum</Link>
          <Link to="/playground">Playground</Link>
          <Link to="/reference">Reference</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
