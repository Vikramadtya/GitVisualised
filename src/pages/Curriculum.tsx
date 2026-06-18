import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Download, BookOpen, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { chapters } from '../data/curriculum';
import { concepts } from '../data/concepts';
import { scenarios } from '../data/scenarios';
import { useScenarioStore } from '../store/useScenarioStore';
import TiltCard from '../components/TiltCard';
import styles from './Curriculum.module.css';

const resources = [
  {
    title: 'Pro Git Book',
    description: 'The entire Pro Git book in PDF format.',
    filename: 'progit.pdf'
  }
];

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Curriculum: React.FC = () => {
  const navigate = useNavigate();
  const setScenario = useScenarioStore(state => state.setScenario);

  const handleStartScenario = (scenarioId: string) => {
    setScenario(scenarioId);
    navigate('/playground');
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-gradient">The Git Mastery Book</h1>
        <p>A comprehensive path to mastering version control from basic commits to advanced DevOps automation.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)' }}>
          Press <kbd style={{ padding: '2px 6px', background: 'var(--color-bg-overlay)', borderRadius: '4px', border: '1px solid var(--color-border-muted)' }}>Cmd+K</kbd> to search the curriculum.
        </p>
      </motion.div>

      <div className={styles.bookLayout}>
        {chapters.map((chapter) => (
          <div key={chapter.id} className={styles.chapterContainer}>
            <motion.div 
              className={styles.chapterHeader}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-gradient">{chapter.title}</h2>
              <p>{chapter.description}</p>
            </motion.div>
            
            <div className={styles.moduleList}>
              {chapter.items.map((item, index) => {
                const isConcept = item.type === 'concept';
                const concept = isConcept ? concepts.find(c => c.id === item.id) : null;
                const scenario = !isConcept ? scenarios.find(s => s.id === item.id) : null;

                if (!concept && !scenario) return null;

                // Alternate sides for the skill tree
                const isLeft = index % 2 === 0;
                const nodeClass = isLeft ? styles.nodeLeft : styles.nodeRight;

                if (isConcept && concept) {
                  return (
                    <motion.div key={`${chapter.id}-${item.id}-${index}`} variants={itemVariants} className={`${styles.nodeContainer} ${nodeClass}`}>
                      <div className={styles.cardWrapper}>
                        <TiltCard>
                          <Link to={`/learn/concept/${concept.id}`} className={`${styles.moduleCard} glass-panel`} style={{ borderLeftColor: 'var(--color-accent-primary)' }}>
                            <div className={styles.moduleInfo}>
                              <div className={styles.moduleType}>
                                <BookOpen size={14} /> Theory Module
                              </div>
                              <h2>{concept.title}</h2>
                              <p>{concept.description}</p>
                              <div className={styles.moduleMeta}>
                                {concept.readTime} read
                              </div>
                            </div>
                            <div className={styles.moduleAction}>
                              <Play size={20} />
                            </div>
                          </Link>
                        </TiltCard>
                      </div>
                    </motion.div>
                  );
                }

                if (!isConcept && scenario) {
                  return (
                    <motion.div key={`${chapter.id}-${item.id}-${index}`} variants={itemVariants} className={`${styles.nodeContainer} ${nodeClass}`}>
                      <div className={styles.cardWrapper}>
                        <TiltCard>
                          <div 
                            onClick={() => handleStartScenario(scenario.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStartScenario(scenario.id)}
                            className={`${styles.moduleCard} glass-panel`}
                            style={{ borderLeftColor: 'var(--color-accent-secondary)' }}
                            role="button"
                            tabIndex={0}
                          >
                            <div className={styles.moduleInfo}>
                              <div className={styles.moduleType}>
                                <Terminal size={14} /> Interactive Lab
                              </div>
                              <h2>{scenario.title}</h2>
                              <p>{scenario.description}</p>
                              <div className={styles.moduleMeta}>
                                Practice Environment
                              </div>
                            </div>
                            <div className={styles.moduleAction}>
                              <Play size={20} />
                            </div>
                          </div>
                        </TiltCard>
                      </div>
                    </motion.div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.header} style={{ marginTop: 'var(--spacing-12)' }}>
        <h2 className="text-gradient">Additional Resources</h2>
        <p>Download official PDF guides and manuals to deepen your understanding.</p>
      </div>

      <div className={styles.resourcesGrid}>
        {resources.map((res) => (
          <a
            key={res.filename}
            href={`/resources/${res.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.resourceCard} glass-panel`}
          >
            <div className={styles.resourceInfo}>
              <h3>{res.title}</h3>
              <p>{res.description}</p>
            </div>
            <div className={styles.resourceAction}>
              <Download size={20} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
