import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, BookOpen, GitMerge } from 'lucide-react';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
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

        {/* Decorative background elements */}
        <div className={styles.glowOrb1}></div>
        <div className={styles.glowOrb2}></div>
      </header>

      <section className={styles.features}>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><GitMerge size={32} /></div>
          <h3>Live Graph Animations</h3>
          <p>See exactly how branching, merging, and rebasing work with beautiful D3.js powered animations.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><Terminal size={32} /></div>
          <h3>Guided On-Rails Sandbox</h3>
          <p>No need to guess. Follow structured scenarios that simulate real-world developer problems.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <div className={styles.featureIcon}><BookOpen size={32} /></div>
          <h3>Pro Git Reference</h3>
          <p>An exhaustive, searchable encyclopedia of commands based on the authoritative Git documentation.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
